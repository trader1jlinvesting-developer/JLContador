
// src/app/pages/movimientos/movimientos-list.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovimientosService } from '../../services/movimientos.service';
import { Movimiento } from '../../models/movimiento.model';
import { RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IonicModule, NavController, AlertController } from '@ionic/angular';


@Component({
  selector: 'app-movimientos-list',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './movimientoslist.page.html',
})
export class MovimientosListPage {
  movimientos$: Observable<Movimiento[]>;

  constructor(private svc: MovimientosService, private router: Router, private alertCtrl: AlertController ) {
    this.movimientos$ = this.svc.obtenerMovimientos();
  }

  irCrear() {
    this.router.navigate(['/movimientos/create']);
  }

 
  async editar(id?: string) {
  if (!id) return;

  //this.router.navigate(['/movimientos', id, 'edit']);

  const alert = await this.alertCtrl.create({
    header: 'No Habilitada',
    message: 'La opción de modificar no está habilitada.',
    buttons: ['OK']
  });

  await alert.present();  // 👈 Esto hace que se muestre en pantalla
}


  async eliminar(id?: string) {
    if (!id) return;
    const confirm = window.confirm('¿Eliminar este movimiento?');
    

    if (confirm) {
      await this.svc.eliminarMovimiento(id);
      //opcional: mostrar alerta o toast
    }

  //   const alert = await this.alertCtrl.create({
  //   header: 'No Habilitada',
  //   message: 'La opción de eliminar no está habilitada.',
  //   buttons: ['OK']
  // });

  //   await alert.present();  // 👈 Esto hace que se muestre en pantalla


  }
}
