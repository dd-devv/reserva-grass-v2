import { Injectable, inject } from '@angular/core';
import { UserService } from './user.service';
import { map, Observable, catchError, of, BehaviorSubject, timer, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private userService = inject(UserService);
  private suscriptionStatus = new BehaviorSubject<boolean>(false);

  constructor() {
    this.initStatusCheck();
  }

  private initStatusCheck() {
    // Verificación inicial
    this.checkSuscriptionStatus().subscribe(
      status => this.suscriptionStatus.next(status)
    );

    // Verificación periódica cada 5 minutos
    timer(300000, 300000).pipe(
      switchMap(() => this.checkSuscriptionStatus())
    ).subscribe(
      status => this.suscriptionStatus.next(status)
    );
  }

  isSuscriptionActive(): Observable<boolean> {
    const id = localStorage.getItem('_id') || sessionStorage.getItem('_id');
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    return this.userService.obtener_suscripciones_empresa(id, token).pipe(
      tap(),
      map(response => {
        // Si la respuesta está vacía o no tiene la propiedad data
        if (Object.keys(response).length === 0 || !response.data) {
          return false;
        }

        // Verificar si hay alguna suscripción confirmada
        const hasSuscripcionActiva = response.data.some(
          (suscripcion: { estado: string }) => suscripcion.estado === 'Confirmado'
        );
        
        return hasSuscripcionActiva;
      }),
      catchError(error => {
        console.error('Error al verificar la suscripción:', error);
        return of(false);
      })
    );
  }

  private checkSuscriptionStatus(): Observable<boolean> {
    const id = localStorage.getItem('_id') || sessionStorage.getItem('_id');
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!id || !token) {
      return of(false);
    }

    return this.userService.obtener_suscripciones_empresa(id, token).pipe(
      tap(),
      map(response => {
        if (Object.keys(response).length === 0 || !response.data) {
          return false;
        }

        const hasSuscripcionActiva = response.data.some(
          (suscripcion: { estado: string }) => suscripcion.estado === 'Confirmado'
        );
        return hasSuscripcionActiva;
      }),
      catchError(error => {
        console.error('Error en verificación periódica:', error);
        return of(false);
      })
    );
  }

  // Método para forzar una actualización del estado
  refreshSuscriptionStatus(): void {
    this.checkSuscriptionStatus().subscribe(
      status => {
        this.suscriptionStatus.next(status);
      }
    );
  }

  // Método para verificar si hay suscripciones vencidas
  checkExpiredSuscriptions(): Observable<boolean> {
    const id = localStorage.getItem('_id') || sessionStorage.getItem('_id');
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!id || !token) {
      return of(false);
    }

    return this.userService.obtener_suscripciones_empresa(id, token).pipe(
      map(response => {
        if (Object.keys(response).length === 0 || !response.data) {
          return false;
        }

        return response.data.some(
          (suscripcion: { estado: string }) => suscripcion.estado === 'Vencido'
        );
      }),
      catchError(() => of(false))
    );
  }
}