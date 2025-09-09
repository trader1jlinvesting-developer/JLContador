import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule,FormGroup, FormBuilder, FormsModule, Validators } from '@angular/forms';
import { NavController, ToastController, IonicModule, AlertController } from '@ionic/angular';
import { ActivatedRoute,   RouterModule } from '@angular/router';
import { OperativasService } from 'src/app/services/operativas.service';
import { Operativa } from '../../models/operativas.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-operativasform',
  templateUrl: './operativasform.page.html',
  styleUrls: ['./operativasform.page.scss'],
  standalone: true,
  imports: [
    CommonModule,          // <-- Necesario para *ngFor y *ngIf
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})


export class OperativasFormPage implements OnInit {
  operativaForm!: FormGroup;
  IdOperativa: string | null = null;
  imagenFile: File | null = null;

    // Catálogos locales para mapear id -> texto
fases = [
  { id: 0, label: 'NA' },
  { id: 1, label: '1' },
  { id: 2, label: '2' },
  { id: 3, label: '3' } 

];

monedas = [
  { value: 'USD', label: 'USD' },
  { value: 'COP', label: 'COP' },
];

  constructor(
    private fb: FormBuilder,
    private operativasService: OperativasService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.IdOperativa = this.route.snapshot.paramMap.get('id');

    // ✅ Definir formulario
   this.operativaForm = this.fb.group({
  Fecha: [null],
  Ciclo: [''],
  NumCuenta:[''],
  Fase: [''],   // <-- mismo nombre que en el HTML
  Activo: [''],
  Setup: [''],
  Riesgo: [''],
  Resultado: [''],
  BalanceActual: [0],
  Estrategia: [''],
  Estatus: ['Abierta'],
  Comentario: [''],
  IdTrader: [''],
  NombreTrader: [''],
  Moneda:['']
});


    // ✅ Si hay id → editar
    if (this.IdOperativa) {
      this.cargarOperativa(this.IdOperativa);
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
      if (this.IdOperativa) {
        // Editar
        await this.operativasService.actualizarOperativa(this.IdOperativa, datos);
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


onFaseChange(event: any) {
  const id = event.detail.value;
  const faseSeleccionada = this.fases.find(t => t.id === id);
  console.log("Fase seleccionada:", faseSeleccionada);
  
  // Si quieres guardar el id
  //this.operativaForm.patchValue({ fase: id });

  // Si prefieres guardar el texto en vez del id
   this.operativaForm.patchValue({ Fase: faseSeleccionada?.label });
}

onMonedaChange(event: any) {  
  const text = event.detail.value; // Aquí ya es "USD" o "COP"
  const label = event.target.textContent.trim(); 
  this.operativaForm.patchValue({ Moneda: text });
}




}
