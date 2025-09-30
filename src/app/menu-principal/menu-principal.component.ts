import { Component, OnInit } from '@angular/core';
import {  
  IonContent,  
  IonMenu, 
  IonTitle,
  IonToolbar, IonList, IonItem, IonIcon, IonLabel, IonNote, IonHeader, IonMenuToggle
} from '@ionic/angular/standalone';
import { MenuController } from '@ionic/angular';
import { RouterModule } from '@angular/router'; //

@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.scss'],
   imports: [
    IonHeader, IonNote, IonLabel, IonIcon, IonItem, IonList, IonContent, 
    IonMenu, IonTitle, IonToolbar, IonMenuToggle, 
    RouterModule
  ],
})
export class MenuPrincipalComponent  implements OnInit {

  constructor(private menuCtrl: MenuController) { }

  ngOnInit() {}

 cerrarMenu() {
  setTimeout(() => this.menuCtrl.close('menuPrincipal'), 200);
}

}
