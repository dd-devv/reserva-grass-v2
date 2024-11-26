import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { ContainerComponent } from './container/container.component';
import { ContainerPerfilComponent } from './pages/perfil/container-perfil/container-perfil.component';
import { SidebarComponent } from './pages/perfil/sidebar/sidebar.component';
import { DatosComponent } from './pages/perfil/pages/datos/datos.component';
import { ReservasComponent } from './pages/perfil/pages/reservas/reservas.component';
import { AccesoComponent } from './pages/perfil/pages/acceso/acceso.component';
import { GeneralComponentsModule } from '../general-components/general-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CanchasComponent } from './pages/canchas/canchas.component';
import { QRCodeModule } from 'angularx-qrcode';
import { PortraitComponent } from './pages/perfil/portrait/portrait.component';
import { TextShortedPipe } from '../../pipes/text-shorted.pipe';
import { PaginatePipe } from '../../pipes/paginate.pipe';


@NgModule({
  declarations: [
    HomeComponent,
    ContactoComponent,
    ContainerComponent,
    ContainerPerfilComponent,
    SidebarComponent,
    DatosComponent,
    ReservasComponent,
    AccesoComponent,
    CanchasComponent,
    PortraitComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    GeneralComponentsModule,
    FormsModule,
    QRCodeModule,
    ReactiveFormsModule,
    PaginatePipe
  ]
})
export class UserModule { }
