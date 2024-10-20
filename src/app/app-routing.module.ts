import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/public/pages/home/home.component';
import { ContactComponent } from './components/public/pages/contact/contact.component';
import { authenticatedUserGuard } from './guards/authenticated-user.guard';

const routes: Routes = [

  // Lazy load para el módulo de autenticación
  {path: '', 
    loadChildren: () => import('./components/public/public.module').then(m => m.PublicModule),
    canActivate: [authenticatedUserGuard]
  },

  // Lazy load para el módulo de autenticación
  {path: 'auth', 
    loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule),
    canActivate: [authenticatedUserGuard]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
