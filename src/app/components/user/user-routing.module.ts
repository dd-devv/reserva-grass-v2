import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContainerComponent } from './container/container.component';
import { HomeComponent } from './pages/home/home.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { DatosComponent } from './pages/perfil/pages/datos/datos.component';
import { ReservasComponent } from './pages/perfil/pages/reservas/reservas.component';
import { AccesoComponent } from './pages/perfil/pages/acceso/acceso.component';
import { ContainerPerfilComponent } from './pages/perfil/container-perfil/container-perfil.component';
import { CanchasComponent } from './pages/canchas/canchas.component';
import { AboutComponent } from './pages/about/about.component';
import { PoliticasComponent } from './pages/politicas/politicas.component';
import { TerminosComponent } from './pages/terminos/terminos.component';

const routes: Routes = [
  {
    path: '',
    component: ContainerComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'nosotros', component: AboutComponent },
      { path: 'contacto', component: ContactoComponent },
      { path: 'politicas-privacidad', component: PoliticasComponent },
      { path: 'terminos', component: TerminosComponent },
      { path: 'contacto', component: ContactoComponent },
      { path: 'ver/:path', component: CanchasComponent },
      {
        path: 'perfil', component: ContainerPerfilComponent,
        children: [
          { path: '', component: DatosComponent },
          { path: 'reservas', component: ReservasComponent },
          { path: 'acceso', component: AccesoComponent }
        ]
      },
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
