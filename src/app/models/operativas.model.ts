export interface Operativa {
  id?: string;                //Id para manejo de Firebase
  IdOperativa: number;        // int
  NumOperativa: number;       // int
  Fecha: Date;                // Date
  NumCuenta: string;          // string
  Ciclo: string;              // string
  Fase: string;               // string
  Activo: string;             // string
  Setup: string;              // string
  Riesgo: string;             // string
  Resultado: string;          // string
  BalanceActual: number;      // numeric
  Estatus: string;            // string
  Comentario: string;         // string
  Estrategia: string;         // string
  IdTrader: string;           // string
  NombreTrader: string;       // string
  Imagen: Uint8Array | null;  // byte (lo manejamos como array de bytes o null)
  FechaRegistro: Date;        // Date
  Valor?: number; 
 
  
}

