import { Pipe, PipeTransform } from '@angular/core';
import { Movimiento } from '../models/movimiento.model';
import { Operativa } from '../models/operativas.model';

@Pipe({
  name: 'filtroGlobal',
  standalone: true
})
export class FiltroGlobalPipe implements PipeTransform {
  transform(movimientos: Movimiento[], termino: string): Movimiento[] {
    if (!movimientos) return [];
    if (!termino) return movimientos;

    termino = termino.toLowerCase();

    return movimientos.filter(m => 
      (m.Numero?.toString().toLowerCase().includes(termino)) ||
      (m.FechaMovimiento?.toString().toLowerCase().includes(termino)) ||
      (m.Concepto?.toLowerCase().includes(termino)) ||
      (m.Empresa?.toLowerCase().includes(termino)) ||
      (m.Tipo?.toLowerCase().includes(termino)) ||
      (m.Total?.toString().toLowerCase().includes(termino)) ||
      (m.Moneda?.toLowerCase().includes(termino))
    );
  }

  
}
