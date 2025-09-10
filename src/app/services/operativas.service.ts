import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  docData,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  limit,
  WithFieldValue,
  DocumentData
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Operativa } from '../models/operativas.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OperativasService {
  private coll = collection(this.firestore, 'operativas');

  constructor(private firestore: Firestore) {}

  /**
   * Convierte string | Date | undefined en Date
   */
  private parsearFecha(fecha: Date | string | undefined): Date {
    if (!fecha) return new Date();

    if (fecha instanceof Date) {
      return fecha;
    }

    const parsed = new Date(fecha);
    if (isNaN(parsed.getTime())) {
      throw new Error(`Fecha inválida: ${fecha}`);
    }

    return parsed;
  }

  /**
   * Generar número consecutivo para NumOperativa
   */
  async generarNumero(): Promise<number> {
    const q = query(this.coll, orderBy('NumOperativa', 'desc'), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return 1;

    const ultimo = snapshot.docs[0].data() as Operativa;
    return (ultimo.NumOperativa || 0) + 1;
  }

  /**
   * Listar todas las operativas
   */
  // obtenerOperativas(): Observable<Operativa[]> {
  //   return collectionData(this.coll, { idField: 'id' }) as Observable<Operativa[]>;
  // }

 obtenerOperativas(): Observable<Operativa[]> {
    const q = query(this.coll, orderBy('Fecha', 'desc'));
    return collectionData(q, { idField: 'id' }).pipe(
      map((items: any[]) =>
        items.map((m) => ({
          ...m,
          Fecha: this.formatearFecha(m.Fecha)
        }))
      )
    );
  }



  /**
   * Obtener una operativa por su ID
   */
  obtenerOperativaPorId(id: string): Observable<Operativa | undefined> {
    const ref = doc(this.firestore, `operativas/${id}`);
    return docData(ref, { idField: 'id' }) as Observable<Operativa | undefined>;
  }

  /**
   * Agregar nueva operativa
   */
  async agregarOperativa(o: Operativa) {
    const numero = await this.generarNumero();

    const op: WithFieldValue<DocumentData> = {
      ...o,
      NumOperativa: numero,
      Fecha: this.parsearFecha(o.Fecha),
      FechaRegistro: this.parsearFecha(o.FechaRegistro)
    };

    return addDoc(this.coll, op);
  }

  /**
   * Actualizar operativa
   */
  actualizarOperativa(id: string, datos: Partial<Operativa>) {
    const ref = doc(this.firestore, `operativas/${id}`);

    const nuevosDatos: Partial<Operativa> = {
      ...datos,
      Fecha: datos.Fecha ? this.parsearFecha(datos.Fecha) : undefined,
      FechaRegistro: datos.FechaRegistro
        ? this.parsearFecha(datos.FechaRegistro)
        : undefined
    };

    return updateDoc(ref, nuevosDatos as any);
  }

  /**
   * Eliminar operativa
   */
  eliminarOperativa(id: string) {
    const ref = doc(this.firestore, `operativas/${id}`);
    return deleteDoc(ref);
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
  // private parsearFecha(fechaStr: any): Date | undefined {
  //   if (!fechaStr) return undefined;

  //   if (fechaStr instanceof Date) return fechaStr;

  //   if (typeof fechaStr === 'string') {
  //     const [dd, mm, yyyy] = fechaStr.split('/');
  //     const fecha = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  //     return isNaN(fecha.getTime()) ? undefined : fecha; // ✅ Evita error
  //   }

  //   if (fechaStr?.seconds) {
  //     return new Date(fechaStr.seconds * 1000);
  //   }

  //   const fecha = new Date(fechaStr);
  //   return isNaN(fecha.getTime()) ? undefined : fecha; // ✅ Evita error
  // }


}


