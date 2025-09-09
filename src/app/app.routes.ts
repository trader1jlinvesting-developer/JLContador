import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'operativas',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
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

