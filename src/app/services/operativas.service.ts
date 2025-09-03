import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
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
import { Operativa } from '../models/operativas.model'

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
    return (ultimo.numOperativa || 0) + 1;
  }

  /**
   * Listar todas las operativas
   */
  obtenerOperativas(): Observable<Operativa[]> {
    return collectionData(this.coll, { idField: 'id' }) as Observable<Operativa[]>;
  }

  /**
   * Agregar nueva operativa
   */
  async agregarOperativa(o: Operativa) {
    const numero = await this.generarNumero();

    const op: WithFieldValue<DocumentData> = {
      ...o,
      NumOperativa: numero,
      Fecha: this.parsearFecha(o.fecha),
      FechaRegistro: this.parsearFecha(o.fechaRegistro)
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
      fecha: datos.fecha ? this.parsearFecha(datos.fecha) : undefined,
      fechaRegistro: datos.fechaRegistro
        ? this.parsearFecha(datos.fechaRegistro)
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
}

