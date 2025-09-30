import { Pipe, PipeTransform } from '@angular/core';
import { Operativa } from 'src/app/models/operativas.model';

@Pipe({
  name: 'filtroGlobalOperativa',
  pure: false
})
export class FiltroGlobalOperativaPipe implements PipeTransform {

  transform(operativas: Operativa[] | null, termino: string): Operativa[] {
    if (!operativas) return [];
    if (!termino || termino.trim() === '') return operativas;

    const term = termino.toLowerCase().trim();

    return operativas.filter(o =>
      (o.NumOperativa?.toString().toLowerCase().includes(term)) ||
      (o.Fecha ? new Date(o.Fecha).toLocaleString().toLowerCase().includes(term) : false) ||
      (o.BalanceActual?.toString().toLowerCase().includes(term)) ||
      (o.NumCuenta?.toLowerCase().includes(term)) ||
      (o.Setup?.toLowerCase().includes(term)) ||
      (o.Resultado?.toLowerCase().includes(term)) ||
      (o.Valor?.toString().toLowerCase().includes(term)) ||
      (o.Comentario?.toLowerCase().includes(term))
    );
  }
}
