import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/public/pages/home/home.component';
import { ContactComponent } from './components/public/pages/contact/contact.component';
import { authenticatedUserGuard } from './guards/authenticated-user.guard';
import { authAdminGuard } from './guards/auth-admin.guard';
import { authUserGuard } from './guards/auth-user.guard';
import { authGrassGuard } from './guards/auth-grass.guard';

const routes: Routes = [

  // Lazy load para el módulo de autenticación
  {
    path: '',
    loadChildren: () => import('./components/public/public.module').then(m => m.PublicModule),
    canActivate: [authenticatedUserGuard]
  },

  // Lazy load para el módulo de autenticación
  {
    path: 'auth',
    loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule),
    canActivate: [authenticatedUserGuard]
  },

  // Lazy load para el módulo de administrador
  {
    path: 'usuario',
    loadChildren: () => import('./components/user/user.module').then(m => m.UserModule),
    canActivate: [authUserGuard]
  },

  // Lazy load para el módulo de administrador
  {
    path: 'admin',
    loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule),
    canActivate: [authAdminGuard]
  },

  // Lazy load para el módulo de grass
  {
    path: 'grass',
    loadChildren: () => import('./components/grass/grass.module').then(m => m.GrassModule),
    canActivate: [authGrassGuard]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
