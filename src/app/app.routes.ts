import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'inicio',
    title: 'Início | Jovens Empreendedores',
    loadComponent: () => import('./home/home').then(({ Home }) => Home),
  },
  {
    path: 'inscricao',
    title: 'Inscrição | Jovens Empreendedores',
    loadComponent: () => import('./signup/signup').then(({ Signup }) => Signup),
  },
  {
    path: 'confirmacao',
    title: 'Confirmação | Jovens Empreendedores',
    loadComponent: () =>
      import('./confirmation/confirmation').then(({ Confirmation }) => Confirmation),
  },
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  { path: '**', redirectTo: 'inicio' },
];
