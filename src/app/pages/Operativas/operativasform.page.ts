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
  { id: 3, label: '3' } ,
  { id: 4, label: 'Testing' } 

];

activos = [
  { id: 0, label: 'NA' },
  { id: 1, label: 'NQ' },
  { id: 2, label: 'BTC' },
  { id: 3, label: 'MNQ' },
  { id: 4, label: 'IA-CARLOS' } ,  
  { id: 5, label: 'IA-SALO' },
  { id: 6, label: 'IA' } 
  

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
  { id: 16, label: 'A4-A+' },
  { id: 17, label: 'N1' },
  { id: 18, label: 'N2' },
  { id: 19, label: 'N3' },
  { id: 20, label: 'N4' },
  //Setupd de amarillas y confirmación con rombos de la estartegia J
  { id: 21, label: 'A-R 1' },
  { id: 22, label: 'A-R 2' },
  { id: 23, label: 'A-R 3' } ,
  { id: 24, label: 'A-R 4' },
  { id: 25, label: 'A-R +' },
  
];

riesgos = [
  { id: 0, label: 'NA' },
  { id: 1, label: '1:1' },
  { id: 2, label: '1:1.5' },
  { id: 3, label: '1:2' } ,
  { id: 4, label: '1:3' } ,
  { id: 5, label: '1:4' } ,
  { id: 6, label: '1:5' } ,
  { id: 5, label: '1:N3' } ,
  { id: 5, label: '2:2 take out' } 

];

estrategias = [
  { id: 0, label: 'NA' },
  { id: 1, label: 'JBase' },
  { id: 2, label: 'JLProfessional' },
  { id: 3, label: 'JLBasic' } ,
  { id: 4, label: 'JLInvertida' } ,
  { id: 5, label: 'Otra' } ,
  { id: 6, label: 'Niveles' } ,
  { id: 7, label: 'A' } ,
  //Amarilla con Rombos
  { id: 8, label: 'A-R' } 

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
