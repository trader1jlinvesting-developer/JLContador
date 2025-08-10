import { Component } from '@angular/core';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenu,
  IonMenuButton,
  IonTitle,
  IonToolbar, IonApp, IonList, IonItem, IonRouterOutlet, IonIcon, IonLabel, IonNote } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForward, listCircle } from 'ionicons/icons';
import { MenuPrincipalComponent } from "./menu-principal/menu-principal.component";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonNote, IonLabel, IonIcon, IonRouterOutlet, IonItem, IonList, IonApp, IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonTitle, IonToolbar, MenuPrincipalComponent],
 
})
export class AppComponent {
  constructor() {
    addIcons({ chevronForward, listCircle });
  }
}
