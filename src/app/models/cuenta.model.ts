export interface Cuenta {
  id?: string;  // Opcional, si vas a leer el ID desde Firestore
  fechaCompra: string;
  fechaExpiracion: string;
  NumCuenta: string;
  Tamano: string;
  Empresa: string;
  Estatus: string;
  Profit: number;
  Stop: number;
  PorcConsistencia: number;
  Descripcion: string;
  EmailCompra: string;
  Responsable: string;
  Nota: string;
  DocumentoRelacionado: string;
  Activa: boolean;
}
