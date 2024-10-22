import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { GeneralComponentsModule } from '../general-components/general-components.module';
import { ContainerComponent } from './container/container.component';
import { CanchaComponent } from './pages/cancha/cancha.component';
import { VerComponent } from './pages/ver/ver.component';


@NgModule({
  declarations: [
    HomeComponent,
    ContactComponent,
    ContainerComponent,
    CanchaComponent,
    VerComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    GeneralComponentsModule
  ]
})
export class PublicModule { }
