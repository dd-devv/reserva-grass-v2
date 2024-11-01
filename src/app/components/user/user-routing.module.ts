import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContainerComponent } from './container/container.component';
import { HomeComponent } from './pages/home/home.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { DatosComponent } from './pages/perfil/pages/datos/datos.component';
import { ReservasComponent } from './pages/perfil/pages/reservas/reservas.component';
import { AccesoComponent } from './pages/perfil/pages/acceso/acceso.component';

const routes: Routes = [
  {
    path: '',
    component: ContainerComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'contacto', component: ContactoComponent },
      {
        path: 'perfil', component: ContactoComponent,
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
