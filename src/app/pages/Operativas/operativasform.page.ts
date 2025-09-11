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

activos = [
  { id: 0, label: 'NA' },
  { id: 1, label: 'NQ' },
  { id: 2, label: 'BTC' },
  { id: 3, label: 'MNQ' },
  { id: 4, label: 'IA' } ,
  { id: 3, label: 'IA-SALO' },
  { id: 4, label: 'IA-CARLOS' } 

];

setups = [
  { id: 0, label: 'NA' },
  { id: 1, label: 'A1' },
  { id: 2, label: 'A2' },
  { id: 3, label: 'A3' } ,
  { id: 4, label: 'A4' },
  { id: 5, label: 'A+' },
  { id: 6, label: 'R1' },
  { id: 7, label: 'R2' } ,
  { id: 8, label: 'R+' } ,
  { id: 9, label: 'J1' },
  { id: 10, label: 'J2' },
  { id: 11, label: 'J3' } ,
  { id: 12, label: 'J12' },
  { id: 13, label: 'A1-A2' },
  { id: 14, label: 'A2-A3' },
  { id: 15, label: 'A3-A4' },
   { id: 16, label: 'A4-A+' }
  
];

riesgos = [
  { id: 0, label: 'NA' },
  { id: 1, label: '1:1' },
  { id: 2, label: '1:1.5' },
  { id: 3, label: '1:2' } ,
  { id: 4, label: '1:3' } ,
  { id: 5, label: '1:4' } ,
  { id: 6, label: '1:5' } ,
  { id: 5, label: '1:N3' } 

];

estrategias = [
  { id: 0, label: 'NA' },
  { id: 1, label: 'JBase' },
  { id: 2, label: 'JLProfessional' },
  { id: 3, label: 'JLBasic' } ,
  { id: 4, label: 'JLInvertida' } ,
  { id: 5, label: 'Otra' }  

];

estatus = [
  { id: 0, label: 'NA' },
  { id: 1, label: 'Sim' },
  { id: 2, label: 'LiveSim' },
  { id: 3, label: 'Aprobada' } ,
  { id: 4, label: 'Fallida' } ,
  { id: 5, label: 'Cancelada' } ,
  { id: 6, label: 'Otra' },
  { id: 7, label: 'Live' },

];

resultados = [
  { id: 0, label: 'NA' },
  { id: 1, label: 'Cara' },
  { id: 2, label: 'Sello' },
  { id: 3, label: 'Stop' } ,
  { id: 4, label: 'Profit' },
  { id: 5, label: 'BE' }  

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
  Estatus: [''],
  Comentario: [''],
  IdTrader: [''],
  NombreTrader: [''],
  Valor:['']
  
});

// Si el formControl de fecha está vacío → asigna la fecha actual
  const fechaHoy = new Date().toISOString().substring(0, 10); // yyyy-MM-dd
  if (!this.operativaForm.get('FechaMovimiento')?.value) {
    this.operativaForm.patchValue({ FechaMovimiento: fechaHoy });
  }

  if (!this.operativaForm.get('FechaRegistro')?.value) {
    this.operativaForm.patchValue({ FechaRegistro: fechaHoy });
  }


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

    const data = this.operativaForm.value as Partial<Operativa>;      
    
    //Se convierte el tipo de fecha a date para que no tenga problemas con firebase
    if(data.Fecha){
      data.Fecha = new Date(data.Fecha);
    }
    
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


//Evento de la lista de Fases
onFaseChange(event: any) {  
  const text = event.detail.value; // 
  const label = event.target.textContent.trim(); 
  this.operativaForm.patchValue({ Fase: text });
}

//Evento de la lista de Activos
// onActivoChange(event: any) {  
//   const text = event.detail.value; // 
//   const label = event.target.textContent.trim(); 
//   this.operativaForm.patchValue({ Activo: text });
// }




}
