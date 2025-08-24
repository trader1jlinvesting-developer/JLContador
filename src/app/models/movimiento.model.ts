// src/app/models/movimiento.model.ts
export interface Movimiento {
  id?: string;                  // id Firestore (autogenerado)
  Consecutivo?: number;         // Número consecutivo interno
  FechaMovimiento?: string | Date;    // Fecha en formato ISO (ej: '2025-08-18T12:34:56Z')
  Numero?: string;              // Número de documento / referencia
  IdTipo?: number;              // Identificador numérico de tipo
  Tipo?: string;  // Tipo de movimiento (controlado o libre)
  IdConcepto?: number;          // Identificador de concepto
  Concepto?: string;            // Nombre del concepto
  Valor?: number;               // Valor unitario
  Moneda?: string;              // Código de moneda (ej: 'USD', 'COP')
  Cantidad?: number;            // Cantidad (ej: unidades)
  Total?: number;               // Total = Cantidad * Valor
  Responsable?: string;         // Persona responsable
  DocumentoRelacionado?: string;// Id o referencia de otro documento relacionado
  Borrado?: boolean;            // Marcador lógico de borrado
  Nota?: string;                // Nota adicional
  NumeroCuenta?: string;        // Relación con cuenta
  Empresa?: string;             // Empresa o proveedor
  // Nuevos opcionales útiles para trazabilidad
  CreadoEn?: string;            // Fecha de creación (ISO)
  ActualizadoEn?: string;       // Fecha de última actualización (ISO)
  FechaRegistro?: string | Date;
  IdCliente?: string; //Codigo unico de cada uno de nuestros clientes para que la App se pueda comercializar mas adelante
                      // Sin necesidad de más desarrollo.

}

