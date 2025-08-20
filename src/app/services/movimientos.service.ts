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
  where
} from '@angular/fire/firestore';
import { Movimiento } from '../models/movimiento.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MovimientosService {
  private coll = collection(this.firestore, 'movimientos');

  constructor(private firestore: Firestore) {}

  obtenerMovimientos(): Observable<Movimiento[]> {
    const q = query(this.coll, orderBy('FechaMovimiento', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Movimiento[]>;
  }

  obtenerPorCuenta(idCuenta: string): Observable<Movimiento[]> {
    const q = query(this.coll, where('IdCuenta', '==', idCuenta), orderBy('FechaMovimiento', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Movimiento[]>;
  }

  agregarMovimiento(m: Movimiento) {
    // ajusta Totales si hace falta antes de enviar
    return addDoc(this.coll, m);
  }

  actualizarMovimiento(id: string, datos: Partial<Movimiento>) {
    const ref = doc(this.firestore, `movimientos/${id}`);
    return updateDoc(ref, datos);
  }

  eliminarMovimiento(id: string) {
    const ref = doc(this.firestore, `movimientos/${id}`);
    return deleteDoc(ref);
  }
}

