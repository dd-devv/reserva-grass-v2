import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HotjarTrackingService {
  constructor(private router: Router) {
    this.initializeRouteTracking();
  }

  private initializeRouteTracking() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.trackPageView(event.url);
    });
  }

  private trackPageView(url: string) {
    // @ts-ignore
    if (window.hj) {
      // @ts-ignore
      window.hj('trigger', 'page_view');
      
      // Opcional: Trackear ruta específica
      // @ts-ignore
      window.hj('trigger', `route_${url.replace(/\//g, '_').toLowerCase()}`);
    }
  }

  // Método global para trackear eventos sin necesidad de llamarlo en cada componente
  trackEvent(eventName: string, eventData: any = {}) {
    // @ts-ignore
    if (window.hj) {
      // @ts-ignore
      window.hj('trigger', eventName, eventData);
    }
  }

  // Método para identificar usuario de forma global
  identifyUser(userId: string, userProperties: any = {}) {
    // @ts-ignore
    if (window.hj) {
      // @ts-ignore
      window.hj('identify', userId, userProperties);
    }
  }
}