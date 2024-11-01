import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { ContainerComponent } from './container/container.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ContainerPerfilComponent } from './pages/perfil/container-perfil/container-perfil.component';
import { SidebarComponent } from './pages/perfil/sidebar/sidebar.component';
import { DatosComponent } from './pages/perfil/pages/datos/datos.component';
import { ReservasComponent } from './pages/perfil/pages/reservas/reservas.component';
import { AccesoComponent } from './pages/perfil/pages/acceso/acceso.component';


@NgModule({
  declarations: [
    HomeComponent,
    ContactoComponent,
    ContainerComponent,
    HeaderComponent,
    FooterComponent,
    ContainerPerfilComponent,
    SidebarComponent,
    DatosComponent,
    ReservasComponent,
    AccesoComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }
