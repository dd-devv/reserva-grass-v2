import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { PagesComponent } from './pages/pages.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';


@NgModule({
  declarations: [
    PagesComponent,
    HomeComponent,
    ContactComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule
  ]
})
export class PublicModule { }
