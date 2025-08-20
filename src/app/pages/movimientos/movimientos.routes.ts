import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./movimientoslist.page').then(m => m.MovimientosListPage),
     //import('./movimientosform.page').then(m => m.MovimientosFormPage),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./movimientosform.page').then(m => m.MovimientosFormPage),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./movimientosform.page').then(m => m.MovimientosFormPage),
  },
];

