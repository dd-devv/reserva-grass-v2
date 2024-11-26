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
import { FormsModule } from '@angular/forms';
import { PasswordComponent } from './pages/datos/password/password.component';
import { CrearComponent } from './pages/canchas/crear/crear.component';
import { ActualizarComponent } from './pages/canchas/actualizar/actualizar.component';
import { GaleriaComponent } from './pages/canchas/galeria/galeria.component';
import { ActualizarCuentaComponent } from './pages/cuentas/actualizar-cuenta/actualizar-cuenta.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { PaginatePipe } from '../../pipes/paginate.pipe';


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
    HomeContainerComponent,
    PasswordComponent,
    CrearComponent,
    ActualizarComponent,
    GaleriaComponent,
    ActualizarCuentaComponent,
    PaymentComponent
  ],
  imports: [
    CommonModule,
    GrassRoutingModule,
    ImageCropperModule,
    GeneralComponentsModule,
    FormsModule,
    PaginatePipe
]
})
export class GrassModule { }
