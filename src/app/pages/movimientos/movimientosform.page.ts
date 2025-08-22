
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

  // Catálogos locales para mapear id -> texto
tipos = [
  { id: 1, label: 'Ingreso' },
  { id: 2, label: 'Gasto' },
  { id: 3, label: 'CXC' },
];

conceptos = [
  { id: 1, label: 'Cuenta 50K' },
  { id: 2, label: 'Pago Emp Fdeo' },
];

monedas = [
  { value: 'USD', label: 'USD' },
  { value: 'COP', label: 'COP' },
];


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
        console.log('formulario NO valido', this.form.value);
        const a = await this.alertCtrl.create({ header: 'Atención', message: 'Complete los campos requeridos', buttons: ['OK'] });
        await a.present();
        return;
      }

      console.log('formulario valido', this.form.value);

      const data = this.form.value as Partial<Movimiento>; 

      console.log('data: ', data);

      //Se convierte el tipo de fecha a date para que no tenga problemas con firebase
      if(data.FechaMovimiento){
        data.FechaMovimiento = new Date(data.FechaMovimiento);
      }

      try {
        if (this.editarId) {
          await this.svc.actualizarMovimiento(this.editarId, data);
        } else {
          await this.svc.agregarMovimiento(data);
        }
        this.nav.back();
      } catch (err) {
        
        console.log('Error: ', err);

        const a = await this.alertCtrl.create({ header: 'Error', message: 'No se pudo guardar', buttons: ['OK'] });
        await a.present();
      }
  }


// Cuando cambia el tipo, mapea el id al texto y lo guarda en "Tipo"
// onTipoChange(ev: any) {
//   console.log('Entro a OnTipeChange');
//   const id = Number(ev?.detail?.value);
//   const found = this.tipos.find(t => t.id === id);
//   this.form.patchValue({ Tipo: found?.label ?? '' });
// }

onTipoChange(event: any) {
  const id = event.detail.value;
  const tipoSeleccionado = this.tipos.find(t => t.id === id);

  console.log("El nombre del tipo 1:", tipoSeleccionado);
  this.form.patchValue({ Tipo: tipoSeleccionado?.label });

  // if (tipoSeleccionado) {
  //   this.form.patchValue({
  //     Tipo: tipoSeleccionado.label
  //   });
  //   console.log("El nombre del tipo 2:", tipoSeleccionado.label);
  // }
}


// Cuando cambia el concepto, mapea el id al texto y lo guarda en "Concepto"
onConceptoChange(ev: any) {
  console.log('Entro a onConceptoChange');
  const id = Number(ev?.detail?.value);
  const found = this.conceptos.find(c => c.id === id);
  this.form.patchValue({ Concepto: found?.label ?? '' });
}

onMonedaChange(event: any) {
  console.log('Entro a onMonedaChange');
  const text = event.detail.value; // Aquí ya es "USD" o "COP"
  const label = event.target.textContent.trim(); 
  this.form.patchValue({ Moneda: text });
}




}
