import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { GeneralComponentsModule } from '../general-components/general-components.module';
import { ContainerComponent } from './container/container.component';
import { VerComponent } from './pages/ver/ver.component';
import { NosotrosComponent } from './pages/nosotros/nosotros.component';
import { FormsModule } from '@angular/forms';
import { PaginatePipe } from '../../pipes/paginate.pipe';
import { DirectorioComponent } from './pages/directorio/directorio.component';
import { PoliticasComponent } from './pages/politicas/politicas.component';
import { TerminosComponent } from './pages/terminos/terminos.component';
import { FaqUserComponent } from './pages/faq-user/faq-user.component';


@NgModule({
  declarations: [
    HomeComponent,
    ContactComponent,
    ContainerComponent,
    VerComponent,
    NosotrosComponent,
    DirectorioComponent,
    PoliticasComponent,
    TerminosComponent,
    FaqUserComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    GeneralComponentsModule,
    FormsModule,
    PaginatePipe
  ]
})
export class PublicModule { }
