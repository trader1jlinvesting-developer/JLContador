// src/app/pages/operativas/operativaslist.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OperativasService } from 'src/app/services/operativas.service';
import { Operativa } from 'src/app/models/operativas.model';
import { FiltroGlobalOperativaPipe } from "../../pipes/filtro-globaloperativa.pipe";
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-operativas-list',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, FiltroGlobalOperativaPipe,FormsModule],
  templateUrl: './operativaslist.page.html',
  styleUrls: ['./operativaslist.page.scss'],
})
export class OperativasListPage implements OnInit {
  operativas$!: Observable<Operativa[]>;
 operativasFiltradas: any[] = [];  // Lista filtrada
  searchTerm: string = '';


  constructor(
    private svc: OperativasService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    // observamos la colección con async pipe en el template
    this.operativas$ = this.svc.obtenerOperativas();
  }

  

  irCrear() {
    this.router.navigate(['/operativas/create']);
  }

  editar(docId?: string) {
    if (!docId) return;
    this.router.navigate(['/operativas', docId, 'edit']);
  }

  async confirmarEliminar(docId?: string) {
    if (!docId) return;

    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Deseas eliminar esta operativa?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => this.eliminar(docId)
        }
      ]
    });

    await alert.present();
  }

  private async eliminar(docId: string) {
    try {
      await this.svc.eliminarOperativa(docId); // Promise<void>
      const toast = await this.toastCtrl.create({
        message: 'Operativa eliminada',
        duration: 1500,
        color: 'success'
      });
      toast.present();
    } catch (err) {
      console.error('Error eliminando operativa', err);
      const toast = await this.toastCtrl.create({
        message: 'Error al eliminar operativa',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }

  // Utilidad segura para mostrar la fecha en la lista
  formatFecha(fecha: any): string {
    if (!fecha) return '';
    // Firestore Timestamp
    if (fecha.seconds && typeof fecha.seconds === 'number') {
      const d = new Date(fecha.seconds * 1000);
      return d.toLocaleString();
    }
    // Date
    if (fecha instanceof Date) return fecha.toLocaleString();
    // ISO string
    const parsed = new Date(fecha);
    if (!isNaN(parsed.getTime())) return parsed.toLocaleString();
    return String(fecha);
  }
}
