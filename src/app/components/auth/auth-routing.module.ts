import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { RegistroEmpresaComponent } from './components/registro-empresa/registro-empresa.component';
import { ContainerComponent } from './container/container.component';
import { WaitComponent } from './components/wait/wait.component';
import { VerifyComponent } from './components/verify/verify.component';
import { ResertPasswordComponent } from './components/resert-password/resert-password.component';
import { ForgottPasswordComponent } from './components/forgott-password/forgott-password.component';

const routes: Routes = [
  {
    path: '',
    component: ContainerComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: 'registro', component: RegistroComponent },
      { path: 'verificar', component: VerifyComponent },
      { path: 'registro-empresa', component: RegistroEmpresaComponent },
      { path: 'wait', component: WaitComponent },
      { path: 'reset-password/:token', component: ResertPasswordComponent },
      { path: 'forgot-password', component: ForgottPasswordComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }