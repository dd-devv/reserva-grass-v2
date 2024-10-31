import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { CuentasComponent } from './pages/cuentas/cuentas.component';
import { ContainerComponent } from './container/container.component';


@NgModule({
  declarations: [
    HomeComponent,
    CuentasComponent,
    ContainerComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
