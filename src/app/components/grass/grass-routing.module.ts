import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContainerComponent } from './container/container.component';
import { HomeComponent } from './pages/home/home.component';
import { CanchasComponent } from './pages/canchas/canchas.component';
import { DatosComponent } from './pages/datos/datos.component';
import { HomeContainerComponent } from './pages/home-container/home-container.component';
import { SuscripcionComponent } from './pages/suscripcion/suscripcion.component';
import { CuentasComponent } from './pages/cuentas/cuentas.component';
import { ReservacionesComponent } from './pages/reservaciones/reservaciones.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { AyudaComponent } from './pages/ayuda/ayuda.component';
import { CrearComponent } from './pages/canchas/crear/crear.component';
import { ActualizarComponent } from './pages/canchas/actualizar/actualizar.component';
import { GaleriaComponent } from './pages/canchas/galeria/galeria.component';
import { ActualizarCuentaComponent } from './pages/cuentas/actualizar-cuenta/actualizar-cuenta.component';
import { PaymentComponent } from './pages/payment/payment.component';

const routes: Routes = [
  {
    path: '',
    component: ContainerComponent,
    children: [
      {
        path: '', component: HomeContainerComponent,
        children: [
          { path: '', component: HomeComponent },
          { path: 'canchas', component: CanchasComponent },
          { path: 'canchas/crear', component: CrearComponent },
          { path: 'canchas/:id_cancha', component: ActualizarComponent },
          { path: 'canchas/galeria/:id_cancha', component: GaleriaComponent },
          { path: 'datos', component: DatosComponent },
          { path: 'suscripcion', component: SuscripcionComponent },
          { path: 'cuentas', component: CuentasComponent },
          { path: 'cuentas/:_id', component: ActualizarCuentaComponent },
          { path: 'reservaciones', component: ReservacionesComponent }
        ]
      },
      { path: 'clientes', component: ClientesComponent },
      { path: 'payment', component: PaymentComponent },
      { path: 'contacto', component: ContactoComponent },
      { path: 'ayuda', component: AyudaComponent }
    ]
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrassRoutingModule { }
