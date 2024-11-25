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
import { CardEmpresaSkeletonComponent } from './card-empresa-skeleton/card-empresa-skeleton.component';
import { ButtonSearchComponent } from './button-search/button-search.component';
import { Time24to12Pipe } from '../../pipes/time24to12.pipe';
import { CardSportFeaturesSkeletonComponent } from './card-sport-features-skeleton/card-sport-features-skeleton.component';
import { HeaderUserComponent } from './header-user/header-user.component';
import { CardHorarioSkeletonComponent } from './card-horario-skeleton/card-horario-skeleton.component';
import { CountdownTimerComponent } from './countdown-timer/countdown-timer.component';
import { HeaderEmpresaComponent } from './header-empresa/header-empresa.component';
import { CardHorarioEmpresaComponent } from './card-horario-empresa/card-horario-empresa.component';
import { FormsModule } from '@angular/forms';
import { TextShortedPipe } from '../../pipes/text-shorted.pipe';



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
    HeaderComponent,
    CardEmpresaSkeletonComponent,
    ButtonSearchComponent,
    Time24to12Pipe,
    TextShortedPipe,
    CardSportFeaturesSkeletonComponent,
    HeaderUserComponent,
    CardHorarioSkeletonComponent,
    CountdownTimerComponent,
    HeaderEmpresaComponent,
    CardHorarioEmpresaComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    CardHorarioSkeletonComponent,
    CardSportFeaturesSkeletonComponent,
    ButtonSearchComponent,
    CardEmpresaSkeletonComponent,
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
    HeaderComponent,
    HeaderUserComponent,
    Time24to12Pipe,
    TextShortedPipe,
    CountdownTimerComponent,
    HeaderEmpresaComponent,
    CarouselImageComponent,
    CardHorarioEmpresaComponent
  ]
})
export class GeneralComponentsModule { }
