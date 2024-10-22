import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardEmpresaComponent } from './card-empresa/card-empresa.component';
import { CardSportFeaturesComponent } from './card-sport-features/card-sport-features.component';
import { CardHorarioComponent } from './card-horario/card-horario.component';
import { CarouselImageComponent } from './carousel-image/carousel-image.component';
import { ModalTiempoComponent } from './components/modal-tiempo/modal-tiempo.component';
import { ModalInstructionsComponent } from './components/modal-instructions/modal-instructions.component';
import { CardRegistroComponent } from './card-registro/card-registro.component';
import { CardRegistroEmpresaComponent } from './card-registro-empresa/card-registro-empresa.component';
import { CardPerfilComponent } from './card-perfil/card-perfil.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';



@NgModule({
  declarations: [
    CardEmpresaComponent,
    CardSportFeaturesComponent,
    CardHorarioComponent,
    CarouselImageComponent,
    ModalTiempoComponent,
    ModalInstructionsComponent,
    CardRegistroComponent,
    CardRegistroEmpresaComponent,
    CardPerfilComponent,
    FooterComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    CardEmpresaComponent,
    CardSportFeaturesComponent,
    CardHorarioComponent,
    CarouselImageComponent,
    ModalTiempoComponent,
    ModalInstructionsComponent,
    CardRegistroComponent,
    CardRegistroEmpresaComponent,
    CardPerfilComponent,
    FooterComponent,
    HeaderComponent
  ]
})
export class GeneralComponentsModule { }
