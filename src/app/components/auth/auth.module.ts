import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { RegistroEmpresaComponent } from './pages/registro-empresa/registro-empresa.component';


@NgModule({
  declarations: [

    LoginComponent,
    RegistroComponent,
    RegistroEmpresaComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
