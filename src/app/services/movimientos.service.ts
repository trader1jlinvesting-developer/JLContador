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

@Injectable({ providedIn: 'root' })
export class MovimientosService {
  private coll = collection(this.firestore, 'movimientos');

  constructor(private firestore: Firestore) {}

  // 🔹 Prefijos por tipo
  private obtenerPrefijo(tipo: string): string {
    switch (tipo) {
      case 'Ingreso': return 'ING';
      case 'Gasto': return 'GTO';
      case 'CXC': return 'CXC';
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

    console.log('Movimiento Servicio 1 : ',  m.Tipo, m);
  
    if (!m.Tipo) {
      console.error('El movimiento no tiene Tipo definido');
    return;
    }
      
    console.log('Movimiento Servicio 4 : ',  m.Tipo, m);

    const numero = await this.generarNumero(m.Tipo);

    const mov: WithFieldValue<DocumentData> = {
      ...m,
      Numero: numero,
      FechaMovimiento: this.parsearFecha(m.FechaMovimiento) // 🔹 guardamos como Date
    };

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

