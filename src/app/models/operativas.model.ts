export interface Operativa {
  id?: string;                //Id para manejo de Firebase
  idOperativa: number;        // int
  numOperativa: number;       // int
  fecha: Date;                // Date
  numCuenta: string;          // string
  ciclo: string;              // string
  fase: string;               // string
  activo: string;             // string
  setup: string;              // string
  riesgo: string;             // string
  resultado: string;          // string
  balanceActual: number;      // numeric
  estatus: string;            // string
  comentario: string;         // string
  estrategia: string;         // string
  idTrader: string;           // string
  nombreTrader: string;       // string
  imagen: Uint8Array | null;  // byte (lo manejamos como array de bytes o null)
  fechaRegistro: Date;        // Date
}

