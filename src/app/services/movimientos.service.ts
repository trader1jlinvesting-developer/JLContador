// src/app/services/movimientos.service.ts 
import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  DocumentData,
  WithFieldValue,
  limit, getDocs
} from '@angular/fire/firestore';
import { Movimiento } from '../models/movimiento.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AgrupadoMes } from '../models/agrupado-mes';

@Injectable({ providedIn: 'root' })
export class MovimientosService {
  private coll = collection(this.firestore, 'movimientos');

  constructor(private firestore: Firestore) { }

  // 🔹 Prefijos por tipo
  private obtenerPrefijo(tipo: string): string {
    switch (tipo) {
      case 'Ingreso': return 'ING';
      case 'Gasto': return 'GTO';
      case 'CXC': return 'CXC';
      case 'CXP': return 'CXP';
      case 'Ajuste': return 'AJT';
      case 'Anulación': return 'ANU';
      default: return 'MOV'; // fallback
    }
  }

  // 🔹 Buscar el último consecutivo de un tipo
  private async obtenerUltimoConsecutivo(tipo: string): Promise<number> {
    const prefijo = this.obtenerPrefijo(tipo);

    const q = query(
      this.coll,
      where('Tipo', '==', tipo),
      orderBy('Numero', 'desc'),
      limit(1)
    );

    const snap = await getDocs(q);
    if (snap.empty) return 0;

    const ultimoNumero = snap.docs[0].data()['Numero'] as string;
    const consecutivo = parseInt(ultimoNumero.replace(prefijo, ''), 10);

    return isNaN(consecutivo) ? 0 : consecutivo;
  }

  // 🔹 Generar número nuevo
  private async generarNumero(tipo: string): Promise<string> {
    const prefijo = this.obtenerPrefijo(tipo);
    const ultimo = await this.obtenerUltimoConsecutivo(tipo);
    return `${prefijo}${(ultimo + 1).toString().padStart(6, '0')}`;
  }

  // 🔹 Utilidad para formatear a DD/MM/YYYY (UI)
  private formatearFecha(fecha: any): string {
    if (!fecha) return '';
    let d: Date;

    if (fecha instanceof Date) {
      d = fecha;
    } else if (fecha?.seconds) {
      d = new Date(fecha.seconds * 1000);
    } else {
      d = new Date(fecha);
    }

    if (isNaN(d.getTime())) return ''; // ✅ Evita RangeError

    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const anio = d.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }

  // 🔹 Utilidad para parsear string DD/MM/YYYY a Date (Firestore)
  private parsearFecha(fechaStr: any): Date | undefined {
    if (!fechaStr) return undefined;

    if (fechaStr instanceof Date) return fechaStr;

    if (typeof fechaStr === 'string') {
      const [dd, mm, yyyy] = fechaStr.split('/');
      const fecha = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
      return isNaN(fecha.getTime()) ? undefined : fecha; // ✅ Evita error
    }

    if (fechaStr?.seconds) {
      return new Date(fechaStr.seconds * 1000);
    }

    const fecha = new Date(fechaStr);
    return isNaN(fecha.getTime()) ? undefined : fecha; // ✅ Evita error
  }

  obtenerMovimientos(): Observable<Movimiento[]> {
    const q = query(this.coll, orderBy('FechaMovimiento', 'desc'));
    return collectionData(q, { idField: 'id' }).pipe(
      map((items: any[]) =>
        items.map((m) => ({
          ...m,
          FechaMovimiento: this.formatearFecha(m.FechaMovimiento)
        }))
      )
    );
  }


  // ==========================
  // 1. Barras - Totales del mes
  // ==========================
  charBarMovimientos(mes: number, anio: number): Observable<{ [key: string]: number }> {
    // Primer día del mes
    const start = new Date(anio, mes - 1, 1);
    // Último día del mes
    const end = new Date(anio, mes, 0, 23, 59, 59, 999);

    const q = query(
      this.coll,
      where('FechaMovimiento', '>=', start),
      where('FechaMovimiento', '<=', end),
      orderBy('FechaMovimiento', 'desc')
    );

    return collectionData(q, { idField: 'id' }).pipe(
      map((items: any[]) => {
        const agrupado: { [key: string]: number } = {};
        items.forEach(m => {
          const tipo = m.Tipo || 'SinTipo';
          const valor = Number(m.Valor) || 0;
          agrupado[tipo] = (agrupado[tipo] || 0) + valor;
        });
        return agrupado;
      })
    );
  }



  // ==========================
  // 2. Línea por días del mes
  // ==========================
  charLineMovimientosMesActual(mes: number, anio: number): Observable<AgrupadoMes> {

    const q = query(this.coll, orderBy('FechaRegistro', 'asc'));

    return collectionData(q, { idField: 'id' }).pipe(
      map((items: any[]) => {
        const agrupado: AgrupadoMes = {};

        items.forEach(m => {
          const fecha = m.FechaMovimiento?.seconds ? new Date(m.FechaMovimiento.seconds * 1000) : new Date(m.FechaMovimiento);
          if (fecha.getMonth() === mes - 1 && fecha.getFullYear() === anio) {

            const dia = fecha.getDate().toString();
            const tipo = m.Tipo || 'SinTipo';
            const valor = Number(m.Valor) || 0;

            if (!agrupado[dia]) agrupado[dia] = {};
            agrupado[dia][tipo] = (agrupado[dia][tipo] || 0) + valor;
          }
        });

        return agrupado;
      })
    );
  }



  // ==========================
  // 3. Línea anual (por meses)
  // ==========================
  charLineMovimientos(anio: number): Observable<{ meses: string[], datasets: any[] }> {
    const q = query(this.coll, orderBy('FechaMovimiento', 'asc'));

    return collectionData(q, { idField: 'id' }).pipe(
      map((items: any[]) => {
        const meses = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const tiposMap: { [tipo: string]: number[] } = {};

        items.forEach(m => {
          const fecha = m.FechaMovimiento?.toDate ? m.FechaMovimiento.toDate() : new Date(m.FechaMovimiento);
          if (fecha.getFullYear() !== anio) return;

          const mesIndex = fecha.getMonth();
          const tipo = m.Tipo || 'SinTipo';
          const valor = Number(m.Valor) || 0;

          if (!tiposMap[tipo]) {
            tiposMap[tipo] = Array(12).fill(0);
          }
          tiposMap[tipo][mesIndex] += valor;
        });

        const datasets = Object.keys(tiposMap).map(tipo => {
          const color = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`;
          return {
            label: tipo,
            data: tiposMap[tipo],
            fill: false,
            tension: 0.1,
            backgroundColor: color,
            borderColor: color
          };
        });

        return { meses, datasets };
      })
    );
  }


  obtenerPorCuenta(idCuenta: string): Observable<Movimiento[]> {
    const q = query(
      this.coll,
      where('IdCuenta', '==', idCuenta),
      orderBy('FechaMovimiento', 'desc')
    );
    return collectionData(q, { idField: 'id' }).pipe(
      map((items: any[]) =>
        items.map((m) => ({
          ...m,
          FechaMovimiento: this.formatearFecha(m.FechaMovimiento)
        }))
      )
    );
  }
 
  // 🔹 Ahora agrega Número único con prefijo + consecutivo
  async agregarMovimiento(m: Movimiento) {
console.log('entro a guardar 2')
    if (!m.Tipo) {
      console.error('El movimiento no tiene Tipo definido');
      return;
    }

    const numero = await this.generarNumero(m.Tipo);

    const mov: WithFieldValue<DocumentData> = {
      ...m,
      Numero: numero,
      FechaMovimiento: this.parsearFecha(m.FechaMovimiento) // 🔹 guardamos como Date
    };
console.log('entro a guardar 3', this.coll)
console.log('entro a guardar 4', mov)
    return addDoc(this.coll, mov);
  }

  actualizarMovimiento(id: string, datos: Partial<Movimiento>) {
    const ref = doc(this.firestore, `movimientos/${id}`);
    const nuevosDatos: Partial<Movimiento> = {
      ...datos,
      FechaMovimiento: this.parsearFecha(datos.FechaMovimiento) // 🔹 guardamos como Date
    };
    return updateDoc(ref, nuevosDatos as any);
  }

  eliminarMovimiento(id: string) {
    const ref = doc(this.firestore, `movimientos/${id}`);
    return deleteDoc(ref);
  }
}

