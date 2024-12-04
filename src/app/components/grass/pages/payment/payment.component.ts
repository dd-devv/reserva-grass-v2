import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { io, Socket } from 'socket.io-client';
import { ToastService } from '../../../../services/toast/toast.service';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  public load_data = false;
  public load_registro = false;
  public inactiveSuscripcion: any = null;
  public isActive = false;

  private token: any;
  private id: any;
  private socket: Socket;

  public cuentas: Array<any> = [];
  public suscripciones: any [] = [];

  constructor(
    private _userService: UserService,
    private _toastService: ToastService,
    private _router: Router,
  ) {
    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');

    this.socket = io(environment.url_socket, {
      path: environment.socketPath
    });
    this.socket.on('connect', () => {
    });
  }

  ngOnInit(): void {
    this.init_data();

    this.socket.on('mostrar-suscripciones', () => {
      this.init_data();
      this._router.navigate(['/grass']);
    });
  }

  init_data() {
    this.load_data = true;
    this._userService.obtener_suscripciones_empresa(this.id, this.token).subscribe({
      next: (res) => {
        if (res.data) {
          this.suscripciones = res.data;

          // Ordenar las suscripciones por fecha de creación (descendente)
          const suscripcionesOrdenadas = res.data.sort((a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          // Buscar la última suscripción, ya sea "Vencido" o "Confirmado"
          const ultimaSuscripcion = suscripcionesOrdenadas[0] || null;
          this.inactiveSuscripcion = ultimaSuscripcion;

          // Definir isActive basado en el estado
          this.isActive = ultimaSuscripcion ? ultimaSuscripcion.estado === 'Confirmado' : false;
        } else {
          this.inactiveSuscripcion = null;
          this.isActive = false;
        }

        this.load_data = false;
      },
      error: (err) => {
        console.error('Error al obtener las suscripciones:', err);
        this.load_data = false;
      }
    });

    this._userService.obtener_cuentas_de_admin(this.token).subscribe(
      response => {
        this.cuentas = response.data;
        this.load_data = false;
      }
    );
  }

  registrar_prueba_gratis() {
    let data = {
      empresa: this.id,
      subtotal: 0,
      transaccion: 123
    }

    this._userService.registro_suscripcion_prueba(data, this.token).subscribe(
      response => {
        if (response.data == undefined) {
          this._toastService.error('No se pudo crear su suscripción');
        } else {
          this._toastService.success('Se creó con éxito');
          this.init_data();
          this._router.navigate(['/grass']);
        }
      }
    );
  }

  registrar_suscripcion() {
    this.load_registro = true;

    let data = {
      empresa: this.id,
      subtotal: 60,
      transaccion: 123
    }

    this._userService.registro_suscripcion_empresa(data, this.token).subscribe(
      response => {
        if (response.data == undefined) {
          this._toastService.error('No se pudo crear su suscripción');
          this.load_registro = false;
        } else {
          this._toastService.success('Se creó con éxito');
          this.load_registro = false;
          this.socket.emit('confirmar-suscripcion-admin', { data: true });
          this.init_data();
        }
      }
    );
  }
}
