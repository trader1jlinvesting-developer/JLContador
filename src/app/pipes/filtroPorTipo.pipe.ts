import { Pipe, PipeTransform } from '@angular/core';
import { Movimiento } from '../models/movimiento.model';

@Pipe({
    name: 'filtroPorTipo'
})
export class FiltroPorTipoPipe implements PipeTransform {
    transform(movimientos: Movimiento[], tipo: string): Movimiento[] {
        if (!tipo || tipo === 'TODOS') return movimientos;

        if (tipo === 'Otros') {
            return movimientos.filter(m =>
                ['CXC', 'CXP', 'Ajuste', 'Anulación', 'Pago Dividendo'].includes(m.Tipo || '')
            );
        }

        return movimientos.filter(m => (m.Tipo || '') === tipo);
    }


}
