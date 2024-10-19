import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/public/pages/home/home.component';
import { ContactComponent } from './components/public/pages/contact/contact.component';
import { authenticatedUserGuard } from './guards/authenticated-user.guard';

const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [authenticatedUserGuard]},
  {path: 'contacto', component: ContactComponent, canActivate: [authenticatedUserGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
