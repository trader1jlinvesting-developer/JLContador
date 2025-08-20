// src/app/models/movimiento.model.ts
export interface Movimiento {
  id?: string;            // id Firestore
  Consecutivo?: number;
  FechaMovimiento?: string; // ISO string
  Numero?: string;
  IdTipo?: number;
  Tipo?: string;
  IdConcepto?: number;
  Concepto?: string;
  Valor?: number;
  Moneda?: string;
  Cantidad?: number;
  Total?: number;
  Responsable?: string;
  DocumentoRelacionado?: string;
  Borrado?: boolean;
  Nota?:string;
  // opcionales: relacion con cuenta si lo agregas
  IdCuenta?: string;

}

