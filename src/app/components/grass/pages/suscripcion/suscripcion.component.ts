import { Component, OnInit } from '@angular/core';
import { GLOBAL } from '../../../../services/global';
import { io, Socket } from 'socket.io-client';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-suscripcion',
  templateUrl: './suscripcion.component.html',
  styleUrl: './suscripcion.component.css'
})
export class SuscripcionComponent implements OnInit {
  public load_data = false;
  public activePagos: boolean = false;
  public activeSuscripcion: any = {};

  private token: any;
  private id: any;
  private socket: Socket;

  constructor(
    private _userService: UserService
  ) {
    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');

    this.socket = io(GLOBAL.url_socket, {
      path: '/socket.io'
    });
    this.socket.on('connect', () => {
    });
  }

  ngOnInit(): void {
    this.init_data();
    
    this.socket.on('mostrar-suscripciones', () => {
      this.init_data();
    });
  }

  init_data() {
    this.load_data = true;
    this._userService.obtener_suscripciones_empresa(this.id, this.token).subscribe(
      response => {
        if (response.data) {
          // Filtrar solo la suscripción confirmada
          const suscripcionConfirmada = response.data.find(
            (susc: any) => susc.estado === 'Confirmado'
          );
          this.activeSuscripcion = suscripcionConfirmada || null;
          this.activePagos = !!suscripcionConfirmada;
          this.load_data = false;
        }
        this.load_data = false;
      }
    );
  }
}