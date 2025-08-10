import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators  } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AlertController } from '@ionic/angular';

//Importar Servicio
import { CuentasService } from '../../services/cuentas.service';

@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.page.html',
  styleUrls: ['./cuentas.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class CuentasPage {
  form: FormGroup;

  maxDate = new Date().toISOString();
  minDate = '2000-01-01';

  constructor(private fb: FormBuilder, private cuentasService: CuentasService,
       private alertCtrl: AlertController
  ) {
    this.form = this.fb.group({
      fechaCompra: [null],
      fechaExpiracion: [null],
      NumCuenta: [''],
      Tamano: [''],
      Empresa: [''],
      Estatus: [''],
      Profit: [null],
      Stop: [null],
      PorcConsistencia: [null],
      Descripcion: [''],
      EmailCompra: [''],
      Responsable: [''],
      Nota: [''],
      DocumentoRelacionado: [''],
      Activa: [true]
    });
  }

  async guardar() {
  if (this.form.valid) {
    const datos = this.form.value;

    try {
      const docRef = await this.cuentasService.agregarCuenta(datos);
      console.log('Documento guardado con ID:', docRef.id);

      const alert = await this.alertCtrl.create({
        header: 'Éxito',
        message: 'La cuenta se ha guardado correctamente.',
        buttons: ['OK'],
      });

      await alert.present();
      this.form.reset(); // Opcional: limpia el formulario
    } catch (error) {
      console.error('Error al guardar:', error);

      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Hubo un problema al guardar la cuenta. Intenta nuevamente.',
        buttons: ['OK'],
      });

      await alert.present();
    }

  } else {
    const alert = await this.alertCtrl.create({
      header: 'Formulario inválido',
      message: 'Por favor llena todos los campos requeridos.',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
  
}

