import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardEmpresaComponent } from './card-empresa/card-empresa.component';
import { CardSportFeaturesComponent } from './card-sport-features/card-sport-features.component';
import { CardHorarioComponent } from './card-horario/card-horario.component';
import { CarouselImageComponent } from './carousel-image/carousel-image.component';
import { ModalTiempoComponent } from './components/modal-tiempo/modal-tiempo.component';
import { ModalInstructionsComponent } from './components/modal-instructions/modal-instructions.component';



@NgModule({
  declarations: [
    CardEmpresaComponent,
    CardSportFeaturesComponent,
    CardHorarioComponent,
    CarouselImageComponent,
    ModalTiempoComponent,
    ModalInstructionsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class GeneralComponentsModule { }
