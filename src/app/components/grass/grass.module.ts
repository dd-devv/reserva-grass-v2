import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrassRoutingModule } from './grass-routing.module';
import { ContainerComponent } from './container/container.component';
import { HomeComponent } from './pages/home/home.component';
import { CanchasComponent } from './pages/canchas/canchas.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';


@NgModule({
  declarations: [
    ContainerComponent,
    HomeComponent,
    CanchasComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    GrassRoutingModule
  ]
})
export class GrassModule { }
