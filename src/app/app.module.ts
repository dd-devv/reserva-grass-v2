import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PublicModule } from './components/public/public.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { PaginatePipe } from './pipes/paginate.pipe';

@NgModule({
  declarations: [
    AppComponent,
    PaginatePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PublicModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
