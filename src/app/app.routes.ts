import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'inicio',
    loadComponent: () => import('./home/home').then(({ Home }) => Home),
  },
  {
    path: 'inscricao',
    loadComponent: () => import('./signup/signup').then(({ Signup }) => Signup),
  },
  {
    path: 'confirmacao',
    loadComponent: () =>
      import('./confirmation/confirmation').then(({ Confirmation }) => Confirmation),
  },
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  { path: '**', redirectTo: 'inicio' },
];
