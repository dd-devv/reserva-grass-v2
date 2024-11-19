import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrassRoutingModule } from './grass-routing.module';
import { ContainerComponent } from './container/container.component';
import { HomeComponent } from './pages/home/home.component';
import { CanchasComponent } from './pages/canchas/canchas.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { PortraitComponent } from './shared/portrait/portrait.component';
import { DatosComponent } from './pages/datos/datos.component';
import { SuscripcionComponent } from './pages/suscripcion/suscripcion.component';
import { CuentasComponent } from './pages/cuentas/cuentas.component';
import { ReservacionesComponent } from './pages/reservaciones/reservaciones.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { AyudaComponent } from './pages/ayuda/ayuda.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { GeneralComponentsModule } from "../general-components/general-components.module";
import { HomeContainerComponent } from './pages/home-container/home-container.component';


@NgModule({
  declarations: [
    ContainerComponent,
    HomeComponent,
    CanchasComponent,
    SidebarComponent,
    PortraitComponent,
    DatosComponent,
    SuscripcionComponent,
    CuentasComponent,
    ReservacionesComponent,
    ClientesComponent,
    ContactoComponent,
    AyudaComponent,
    HomeContainerComponent
  ],
  imports: [
    CommonModule,
    GrassRoutingModule,
    ImageCropperModule,
    GeneralComponentsModule
]
})
export class GrassModule { }
