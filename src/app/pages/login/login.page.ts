import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
})
export class LoginPage {
  loginForm: FormGroup;
  email: string = "";
  password: string = "";
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async login() {
    if (!this.loginForm.valid) {
      const t = await this.toastCtrl.create({
        message: 'Por favor complete los campos.',
        duration: 2000,
        color: 'warning',
        position: 'top'
      });
      await t.present();
      return;
    }

    const { email, password } = this.loginForm.value;

    // Credenciales temporales permitidas (solo local)
    if (email === 'trader1jlinvesting@gmail.com' && password === 'Tlotrp10$') {
      // redirige a home
      await this.router.navigate(['/home']);
      return;
    }

    const toast = await this.toastCtrl.create({
      message: 'Usuario o contraseña incorrectos — no autorizado',
      duration: 2500,
      position: 'top',
      color: 'danger'
    });
    toast.present();
  }

  irARegistro() {
    this.router.navigate(['/registro']);
  }
}

