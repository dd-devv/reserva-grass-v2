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


@NgModule({
  declarations: [
    LoginComponent,
    RegistroComponent,
    RegistroEmpresaComponent,
    ContainerComponent,
    WaitComponent,
    VerifyComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    GeneralComponentsModule,
    ReactiveFormsModule,
    GoogleMapsModule
  ]
})
export class AuthModule { }
