// src/app/pages/movimientos/movimientos-form.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController, AlertController } from '@ionic/angular';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MovimientosService } from '../../services/movimientos.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MovimientosService as _ } from '../../services/movimientos.service';
import { Movimiento } from 'src/app/models/movimiento.model';
import { Location } from '@angular/common';
@Component({
  selector: 'app-movimientos-form',
  standalone: true,
  styleUrls: ['movimientosform.page.scss'],
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
    { id: 4, label: 'CXP' },
    { id: 5, label: 'Ajuste' },
    { id: 6, label: 'Anulación' },
    { id: 7, label: 'Pago Dividendo' }

  ];

  conceptos = [
    { id: 1, label: 'NA' },
    { id: 2, label: 'Cuenta 50K' },
    { id: 3, label: 'Cuenta 100K' },
    { id: 4, label: 'Reset Sim' },
    { id: 5, label: 'Retiro' },
    { id: 6, label: 'Aporte Socio' },
    { id: 7, label: 'Fee Activación 50K' },
    { id: 8, label: 'Fee Activación 100K' },
    { id: 9, label: 'Prestamo' },
    { id: 10, label: 'Por sobrante' },
    { id: 11, label: 'Por faltante' },
    { id: 12, label: 'Cuenta Live' },
    { id: 13, label: 'Pago' },
    { id: 14, label: 'Comisión' },
    { id: 15, label: 'Agente IA' },
    { id: 16, label: 'Cuenta 25K' },
    { id: 17, label: 'Fee Activación 25K' },
    { id: 18, label: 'Reset Live Sim' },
    { id: 19, label: 'Salario' },
    { id: 20, label: 'Dividendo Mensual' },
    { id: 21, label: 'Dividendo Anual' },
    { id: 22, label: 'Viáticos' },
    { id: 23, label: 'Fiesta fin de año' },
    { id: 24, label: 'Cobro adicional por retiro' }

  ];

  monedas = [
    { value: 'USD', label: 'USD' },
    { value: 'COP', label: 'COP' },
  ];

  empresas = [
    { value: 'NA', label: 'NA' },
    { value: 'E2T', label: 'E2T' },
    { value: 'MFF', label: 'MFF' },
    { value: 'ELT', label: 'Elite Trader' },
    { value: 'BUL', label: 'Bulenox' },
    { value: 'APX', label: 'Apex' },
    { value: 'WBI', label: 'Walbi' },
    { value: 'COL', label: 'Colaborador' },
    { value: 'INV', label: 'Inversionista' }

  ];


  constructor(
    private fb: FormBuilder,
    private svc: MovimientosService,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private nav: NavController,
    private location: Location
  ) {

    this.form = this.fb.group({
      FechaMovimiento: [null],
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
      NumeroCuenta: [''],
      Empresa: [''],
      FechaRegistro: [null],
      IdCliente: ['1'],
      Factura: [''],
    });

  }

  ngOnInit() {

    // Si el formControl de fecha está vacío → asigna la fecha actual
    const fechaHoy = new Date().toISOString().substring(0, 10); // yyyy-MM-dd
    if (!this.form.get('FechaMovimiento')?.value) {
      this.form.patchValue({ FechaMovimiento: fechaHoy });
    }

    if (!this.form.get('FechaRegistro')?.value) {
      this.form.patchValue({ FechaRegistro: fechaHoy });
    }

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
    // usamos setTimeout para esperar a que Angular/Ionic actualice el valor
    setTimeout(() => {
      const v = Number(this.form.get('Valor')?.value || 0);
      const c = Number(this.form.get('Cantidad')?.value || 1);
      const t = v * c;

      console.log('Valor:', v, 'Cantidad:', c, 'Total:', t);

      this.form.patchValue({ Total: t }, { emitEvent: false });
    }, 0);
  }


  goBack() {
    this.location.back();
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

    //Se convierte el tipo de fecha a date para que no tenga problemas con firebase
    if (data.FechaMovimiento) {
      data.FechaMovimiento = new Date(data.FechaMovimiento);
    }

    try {
      if (this.editarId) {
        await this.svc.actualizarMovimiento(this.editarId, data);

        const msa = await this.alertCtrl.create({ header: 'Actualizado', message: 'Se actualizo correctamente el movimiento', buttons: ['OK'] });
        await msa.present();

      } else {
        console.log('entro a guardar 1', data)
        await this.svc.agregarMovimiento(data);
        
        const msa = await this.alertCtrl.create({ header: 'Guardado', message: 'Se guardo correctamente el movimiento', buttons: ['OK'] });
        await msa.present();

      }
      console.log('salio de guardar ' )
      this.nav.back();
    } catch (err) {

      console.log('Error: ', err);

      const a = await this.alertCtrl.create({ header: 'Error', message: 'No se pudo guardar', buttons: ['OK'] });
      await a.present();
    }
  }


  onTipoChange(event: any) {
    const id = Number(event.target.value);
    const tipoSeleccionado = this.tipos.find(t => t.id === id);

    console.log("onTipoChange", tipoSeleccionado);

    this.form.patchValue({
      Tipo: tipoSeleccionado?.label ?? ''
    });
  }


  // Cuando cambia el concepto, mapea el id al texto y lo guarda en "Concepto"
  onConceptoChange(event: any) {
    const id = Number(event.target.value);
    const found = this.conceptos.find(c => c.id === id);

    console.log("onConceptoChange:", found);

    this.form.patchValue({
      Concepto: found?.label ?? ''
    });
  }

  onMonedaChange(event: any) {
    const value = event.target.value;           // Ej: "USD" o "COP"
    const label = event.target.options[event.target.selectedIndex].text; // Texto visible

    console.log("onMonedaChange:", label);

    this.form.patchValue({
      Moneda: value
    });
  }

}