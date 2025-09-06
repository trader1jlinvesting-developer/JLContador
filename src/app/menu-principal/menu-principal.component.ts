import { Component, OnInit } from '@angular/core';
import {  
  IonContent,  
  IonMenu, 
  IonTitle,
  IonToolbar, IonList, IonItem, IonIcon, IonLabel, IonNote, IonHeader } from '@ionic/angular/standalone';

import { RouterModule } from '@angular/router'; //

@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.scss'],
  imports: [IonHeader, IonNote, IonLabel, IonIcon, IonItem, IonList, IonContent, IonMenu, IonTitle, IonToolbar, RouterModule],
})
export class MenuPrincipalComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
