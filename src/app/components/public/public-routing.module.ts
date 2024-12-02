import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContainerComponent } from './container/container.component';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { VerComponent } from './pages/ver/ver.component';
import { NosotrosComponent } from './pages/nosotros/nosotros.component';
import { DirectorioComponent } from './pages/directorio/directorio.component';
import { PoliticasComponent } from './pages/politicas/politicas.component';
import { TerminosComponent } from './pages/terminos/terminos.component';
import { FaqUserComponent } from './pages/faq-user/faq-user.component';

const routes: Routes = [
  {
    path: '',
    component: ContainerComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'contacto', component: ContactComponent },
      { path: 'nosotros', component: NosotrosComponent },
      { path: 'ver/:path', component: VerComponent },
      { path: 'directorio', component: DirectorioComponent },
      { path: 'politicas-privacidad', component: PoliticasComponent },
      { path: 'terminos-condiciones', component: TerminosComponent },
      { path: 'preguntas-frecuentes', component: FaqUserComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
