import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule,FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController, ToastController, IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { OperativasService } from 'src/app/services/operativas.service';
import { Operativa } from '../../models/operativas.model';
import { IonHeader, IonLabel, IonToolbar, IonButton } from "@ionic/angular/standalone";


@Component({
  selector: 'app-operativasform',
  templateUrl: './operativasform.page.html',
  styleUrls: ['./operativasform.page.scss'],
  imports: [IonHeader, IonicModule],
})
export class OperativasFormPage implements OnInit {
  operativaForm!: FormGroup;
  idOperativa: string | null = null;
  imagenFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private operativasService: OperativasService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.idOperativa = this.route.snapshot.paramMap.get('id');

    // ✅ Definir formulario
    this.operativaForm = this.fb.group({
      Fecha: [null, Validators.required],
      Ciclo: [''],
      Fase: [''],
      Activo: ['', Validators.required],
      Setup: [''],
      Riesgo: [''],
      Resultado: [''],
      BalanceActual: [0],
      Estrategia: [''],
      Estatus: ['Abierta', Validators.required],
      Comentario: [''],
      IdTrader: [''],
      NombreTrader: ['']
    });

    // ✅ Si hay id → editar
    if (this.idOperativa) {
      this.cargarOperativa(this.idOperativa);
    }
  }

  // 📌 Cargar datos para edición
  private cargarOperativa(id: string) {
    this.operativasService.obtenerOperativaPorId(id).subscribe((data) => {
      if (data) {
        this.operativaForm.patchValue(data);
      }
    });
  }

  // 📌 Manejo de imagen
  subirImagen(event: any) {
    this.imagenFile = event.target.files[0];
  }

  // 📌 Guardar
  async guardarOperativa() {
    if (this.operativaForm.invalid) return;

    const datos: Operativa = {
      ...this.operativaForm.value,
      Imagen: this.imagenFile ? await this.fileToBase64(this.imagenFile) : null
    };

    try {
      if (this.idOperativa) {
        // Editar
        await this.operativasService.actualizarOperativa(this.idOperativa, datos);
        this.mostrarToast('Operativa actualizada ✅');
      } else {
        // Crear
        await this.operativasService.agregarOperativa(datos);
        this.mostrarToast('Operativa creada ✅');
      }
      this.navCtrl.back();
    } catch (error) {
      console.error(error);
      this.mostrarToast('❌ Error al guardar');
    }
  }

  // 📌 Utilidad para convertir archivo a Base64
  private fileToBase64(file: File): Promise<string | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  // 📌 Toast de feedback
  private async mostrarToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
      color: 'primary'
    });
    toast.present();
  }
}
