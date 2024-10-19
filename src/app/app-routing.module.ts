import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/public/pages/home/home.component';
import { ContactComponent } from './components/public/pages/contact/contact.component';
import { authenticatedUserGuard } from './guards/authenticated-user.guard';

const routes: Routes = [
  //Rutas publicas
  {path: '', component: HomeComponent, canActivate: [authenticatedUserGuard]},
  {path: 'contacto', component: ContactComponent, canActivate: [authenticatedUserGuard]},

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
