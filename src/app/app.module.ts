import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PublicModule } from './components/public/public.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { PaginatePipe } from './pipes/paginate.pipe';
import { GeneralComponentsModule } from './components/general-components/general-components.module';
import { ToastrModule } from 'ngx-toastr';
import { GoogleMapsModule } from '@angular/google-maps';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import localeEs from "@angular/common/locales/es";
import { registerLocaleData } from "@angular/common";
import { TextShortedPipe } from './pipes/text-shorted.pipe';
import { HotjarTrackingService } from './services/hotjar-tracking.service';
registerLocaleData(localeEs, "es");

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    GoogleMapsModule,
    ToastrModule.forRoot(),
    AppRoutingModule,
    PublicModule,
    GeneralComponentsModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: LOCALE_ID, useValue: "es" },
    HotjarTrackingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private hotjarTrackingService: HotjarTrackingService) {
  }
}
