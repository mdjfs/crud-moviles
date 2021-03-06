import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'welcome',
    loadChildren: () => import('./public/welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./public/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registration',
    loadChildren: () => import('./public/registration/registration.module').then( m => m.RegistrationPageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./protected/menu/menu.module').then( m => m.MenuPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'menu/:id',
    loadChildren: () => import('./protected/menu/menu.module').then( m => m.MenuPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'form/:menuId',
    loadChildren: () => import('./protected/form/form.module').then( m => m.FormPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./protected/dashboard/dashboard.module').then( m => m.DashboardPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'error',
    loadChildren: () => import('./components/modals/error/error.module').then( m => m.ErrorPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'answers',
    loadChildren: () => import('./protected/answers/answers.module').then( m => m.AnswersPageModule),
    canActivate: [AuthGuardService]
  }




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
