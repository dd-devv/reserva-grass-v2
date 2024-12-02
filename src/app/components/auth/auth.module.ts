import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { ContainerComponent } from './container/container.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { RegistroEmpresaComponent } from './components/registro-empresa/registro-empresa.component';
import { GeneralComponentsModule } from "../general-components/general-components.module";
import { ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { WaitComponent } from './components/wait/wait.component';
import { VerifyComponent } from './components/verify/verify.component';
import { FormsModule } from '@angular/forms';
import { ResertPasswordComponent } from './components/resert-password/resert-password.component';
import { ForgottPasswordComponent } from './components/forgott-password/forgott-password.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegistroComponent,
    RegistroEmpresaComponent,
    ContainerComponent,
    WaitComponent,
    VerifyComponent,
    ResertPasswordComponent,
    ForgottPasswordComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    GeneralComponentsModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    FormsModule
  ]
})
export class AuthModule { }
