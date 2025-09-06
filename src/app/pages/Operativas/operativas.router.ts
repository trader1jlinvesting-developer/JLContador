import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./operativaslist.page').then(m => m.OperativasListPage),
     //import('./movimientosform.page').then(m => m.MovimientosFormPage),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./operativasform.page').then(m => m.OperativasFormPage),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./operativasform.page').then(m => m.OperativasFormPage),
  },
];