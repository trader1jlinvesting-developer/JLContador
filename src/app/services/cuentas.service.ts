// src/app/services/cuentas.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, addDoc, deleteDoc, updateDoc, doc } from '@angular/fire/firestore';
import { Cuenta } from '../models/cuenta.model';
import { Observable } from 'rxjs';
import { CollectionReference, DocumentData } from '@firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class CuentasService {
  private cuentasCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.cuentasCollection = collection(this.firestore, 'cuentas');
  }

  //obtenerCuentas(): Observable<Cuenta[]> {
    //return collectionData(this.cuentasRef, { idField: 'id' }) as Observable<Cuenta[]>;
  //}

  //agregarCuenta(cuenta: Cuenta) {
    //return addDoc(this.cuentasRef, cuenta);
  //}
  agregarCuenta(cuenta: any): Promise<any> {
      return addDoc(this.cuentasCollection, cuenta);
    }


  actualizarCuenta(id: string, cuenta: Partial<Cuenta>) {
  const cuentaDoc = doc(this.firestore, `cuentas/${id}`);
  return updateDoc(cuentaDoc, cuenta);
  }

  eliminarCuenta(id: string) {
    const cuentaDoc = doc(this.firestore, `cuentas/${id}`);
    return deleteDoc(cuentaDoc);
  }
}

