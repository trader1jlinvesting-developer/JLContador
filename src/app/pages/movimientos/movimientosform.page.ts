
// src/app/pages/movimientos/movimientos-form.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController, AlertController } from '@ionic/angular';
import { ReactiveFormsModule,FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MovimientosService } from '../../services/movimientos.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MovimientosService as _ } from '../../services/movimientos.service';
import { Movimiento } from 'src/app/models/movimiento.model';

@Component({
  selector: 'app-movimientos-form',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, RouterModule],
  templateUrl: './movimientosform.page.html'
})
export class MovimientosFormPage implements OnInit {

  form: FormGroup;
  maxDate = new Date().toISOString();
  minDate = '2000-01-01';
  
  editarId: string | null = null; 


  constructor(
    private fb: FormBuilder,
    private svc: MovimientosService,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private nav: NavController
  ) {

   this.form = this.fb.group({
      FechaMovimiento: [null ],
      Numero: [''],
      IdTipo: [null, Validators.required],
      Tipo: [''],
      IdConcepto: [null, Validators.required],
      Concepto: [''],
      Valor: [0, Validators.required],
      Moneda: [''],
      Cantidad: [1],
      Total: [0],
      Responsable: [''],
      DocumentoRelacionado: [''],
      Nota: [''],
      IdCuenta: ['']
    });

  }


  ngOnInit() {
    this.editarId = this.route.snapshot.paramMap.get('id');
    if (this.editarId) {
      // cargar movimiento para editar (implementar si quieres)
      // this.svc.obtenerPorId(this.editarId).subscribe(...)
    }

    // recalcular total al cambiar valor o cantidad
    this.form.get('Valor')?.valueChanges.subscribe(() => this.recalcularTotal());
    this.form.get('Cantidad')?.valueChanges.subscribe(() => this.recalcularTotal());
  }

  recalcularTotal() {
    const v = Number(this.form.value.Valor || 0);
    const c = Number(this.form.value.Cantidad || 1);
    this.form.patchValue({ Total: v * c }, { emitEvent: false });
  }

  async guardar() {
    if (this.form.invalid) {
      const a = await this.alertCtrl.create({ header: 'Atención', message: 'Complete los campos requeridos', buttons: ['OK'] });
      await a.present();
      return;
    }

   const data = this.form.value as Partial<Movimiento>; 

    try {
      if (this.editarId) {
        await this.svc.actualizarMovimiento(this.editarId, data);
      } else {
        await this.svc.agregarMovimiento(data);
      }
      this.nav.back();
    } catch (err) {
      const a = await this.alertCtrl.create({ header: 'Error', message: 'No se pudo guardar', buttons: ['OK'] });
      await a.present();
    }
  }
}
