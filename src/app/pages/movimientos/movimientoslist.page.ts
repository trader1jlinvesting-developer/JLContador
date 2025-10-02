
// src/app/pages/movimientos/movimientos-list.page.ts
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovimientosService } from '../../services/movimientos.service';
import { Movimiento } from '../../models/movimiento.model';
import { RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IonicModule, NavController, AlertController, } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { FiltroPorTipoPipe } from "../../pipes/filtroPorTipo.pipe";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FiltroGlobalPipe } from "../../pipes/filtroGlobal.pipe";



@Component({
  selector: 'app-movimientos-list',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, FormsModule, FiltroPorTipoPipe, FiltroGlobalPipe],
  templateUrl: './movimientoslist.page.html',
  styleUrls: ['./movimientoslist.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})


export class MovimientosListPage {

  tipoSeleccionado = 'Ingreso';
  terminoBusqueda = '';

  @ViewChild('slides', { static: false }) slides!: any;
  swiperReady = false;

  movimientos$: Observable<Movimiento[]>;

  constructor(private svc: MovimientosService, private router: Router, private alertCtrl: AlertController) {
    this.movimientos$ = this.svc.obtenerMovimientos();
  }

  irCrear() {
    this.router.navigate(['/movimientos/create']);
  }
  onBuscar() {
    // no necesitas nada aquí si usas pipe con ngModel
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.swiperReady = true;
    }, 200);
  }
  cambiarSlide() {
    if (!this.swiperReady || !this.slides?.swiper) return;

    const index =
      this.tipoSeleccionado === 'Ingreso' ? 1 :
        this.tipoSeleccionado === 'Gasto' ? 2 : 3;

    this.slides.swiper.slideTo(index);
  }

  onSwipeChange() {
    if (!this.slides?.swiper) return;

    const index = this.slides.swiper.activeIndex;
    this.tipoSeleccionado =
      index === 1 ? 'Ingreso' :
        index === 2 ? 'Gasto' : 'Otros';
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
    //if (!id) return;
    //const confirm = window.confirm('¿Eliminar este movimiento?');


    //if (confirm) {
    // await this.svc.eliminarMovimiento(id);
      //opcional: mostrar alerta o toast
    //}

      const alert = await this.alertCtrl.create({
      header: 'No Habilitada',
      message: 'La opción de eliminar no está habilitada.',
      buttons: ['OK']
    });

      await alert.present();  // 👈 Esto hace que se muestre en pantalla


  }
}
