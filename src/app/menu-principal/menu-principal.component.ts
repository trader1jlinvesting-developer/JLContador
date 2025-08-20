import { Component, OnInit } from '@angular/core';
import {  
  IonContent,
  IonHeader,
  IonMenu, 
  IonTitle,
  IonToolbar, IonList, IonItem, IonIcon, IonLabel, IonNote } from '@ionic/angular/standalone';

import { RouterModule } from '@angular/router'; //

@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.scss'],
  imports: [IonNote, IonLabel, IonIcon, IonItem, IonList, IonContent, IonHeader, IonMenu, IonTitle, IonToolbar, RouterModule],
})
export class MenuPrincipalComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
