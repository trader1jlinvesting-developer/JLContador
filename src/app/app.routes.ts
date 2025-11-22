import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
   {
    path: 'reportes',
    loadComponent: () => import('./pages/reportes/reportes.page').then( m => m.ReportesPage)
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page').then(m => m.HomePage),
  },
  {
    path: 'movimientos',
    loadChildren: () =>
      import('./pages/movimientos/movimientos.routes').then(
        (m) => m.routes
      ),
  }
  ,
   {
    path: 'operativas',
    loadChildren: () =>
      import('./pages/Operativas/operativas.router').then(
        (s) => s.routes
      ),
  },
];

