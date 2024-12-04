import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';

interface BotonHora {
  estado: string;
  fecha: Date;
  hora: number;
  disponible: boolean;
  id: string;
}

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrl: './ver.component.css'
})
export class VerComponent implements OnInit {
  public path: string = '';
  public id_cancha: any;
  public url: any;
  public load_data = false;
  public load_btn_ver = true;
  public ver_caracteristicas = false;
  public canchas: any = [];
  public reservaciones: any = [];
  public cancha_ver: any = {};
  public empresa: any = {};
  public horasReserva: number = 1;
  botonesHoras: BotonHora[] = [];
  fechaSeleccionada: Date | null = null;

  ahora: Date = new Date();

  public tipo_cancha = 'futbol';
  public hora_inicio = 0;
  public hora_fin = 0;
  public fecha = '';

  constructor(
    private _router: Router,
    private _userService: UserService,
    private _title: Title,
    private _toastrService: ToastrService
  ) {
    this.url = environment.url;
    const ruta = _router.url.split('/');
    this.path = ruta[ruta.length - 1];
  }

  ngOnInit(): void {
    this._title.setTitle('Ver Canchas');
    this.horasReserva = 1;
    this.fechaSeleccionada = new Date();
    this.init_data();
    this.inicializarBotonesHoras();
  }

  handleCancha(tipo_cancha: string) {
    this.tipo_cancha = tipo_cancha;
  }

  handleIdCancha(id: string) {
    this.click_ver(id);
  }

  handleFecha(fecha: any) {
    this.fecha = fecha;
    this.fechaSeleccionada = fecha;
    this.inicializarBotonesHoras();
  }

  private inicializarBotonesHoras() {
    this.botonesHoras = [];
    const ahora = new Date(this.fechaSeleccionada!);
    const horaActual = this.ahora.getHours();

    let primerHora;

    // Determinar la hora inicial
    if (this.fechaSeleccionada!.toDateString() === this.ahora.toDateString()) {
      primerHora = horaActual + 1;
      if (primerHora >= this.hora_fin) {
        return;
      }
    } else {
      primerHora = this.hora_inicio;
    }

    primerHora = Math.max(primerHora, this.hora_inicio);

    // Crear botones para cada hora
    for (let j = primerHora; j < this.hora_fin; j++) {
      const horaFormateada = j < 10 ? `0${j}` : `${j}`;
      const fecha = new Date(ahora);
      const hora = parseInt(horaFormateada);
      let estadoBoton = 'Libre';
      let disponibleBtn = true;

      // Verificar si hay reservaciones que afecten esta hora
      if (this.reservaciones && this.reservaciones.length > 0) {
        for (const reservacion of this.reservaciones) {
          const reservacionFecha = new Date(reservacion.fecha);

          // Verificar si la reservación corresponde al día seleccionado
          if (
            fecha.getDate() === reservacionFecha.getDate() &&
            fecha.getMonth() === reservacionFecha.getMonth() &&
            fecha.getFullYear() === reservacionFecha.getFullYear()
          ) {
            // Verificar si la hora actual está dentro del rango de la reservación
            if (
              hora >= parseInt(reservacion.hora_inicio) &&
              hora < parseInt(reservacion.hora_fin)
            ) {
              estadoBoton = reservacion.estado;
              disponibleBtn = false;
              break;
            }
          }
        }
      }

      // Verificar si es hora pasada para el día actual
      if (this.fechaSeleccionada!.toDateString() === this.ahora.toDateString()) {
        if (hora <= horaActual) {
          estadoBoton = 'Pasado';
          disponibleBtn = false;
        }
      }

      const id = `00${j}`.slice(-4);
      const boton: BotonHora = {
        estado: estadoBoton,
        fecha,
        hora: parseInt(horaFormateada),
        disponible: disponibleBtn,
        id
      };

      this.botonesHoras.push(boton);
    }
  }

  onHoraSeleccionada(index: number) {
    const boton = this.botonesHoras[index];
    if (this.horasReserva > 4 || this.horasReserva < 1) {
      this._toastrService.error('Se permite como máximo 4 horas!', 'ERROR');
      this.horasReserva = 1;
      return;
    }

    if (boton.disponible) {
      boton.estado = boton.estado === 'Libre' ? 'Reservado' : 'Libre';
      localStorage.setItem('fecha_reserva', boton.fecha.toDateString());
      localStorage.setItem('hora_inicio', boton.hora.toString());
      localStorage.setItem('hora_fin', this.botonesHoras[index + this.horasReserva - 1]?.hora.toString() ?? boton.hora);
      localStorage.setItem('afuera', 'Y');
      this._router.navigate(['/login']);
    }
  }

  isHoraPasada(fecha: Date, hora: string): boolean {
    const ahora = new Date();
    const horaSeleccionada = new Date(fecha);
    horaSeleccionada.setHours(parseInt(hora.split(':')[0], 10), 0);

    return ahora > horaSeleccionada;
  }

  onDateChange(event: any) {
    this.fechaSeleccionada = new Date(event.target.value);
    this.inicializarBotonesHoras();
  }

  init_data() {
    this.load_data = true;

    this._userService.obtener_empresa_publico(this.path).subscribe((response) => {
      if (response.data == undefined) {
        // Manejo de datos indefinidos
      } else {
        this.empresa = response.data;
        this.hora_inicio = this.empresa.hora_inicio;
        this.hora_fin = this.empresa.hora_fin;

        this._userService.obtener_canchas(this.empresa._id).subscribe({
          next: (res) => {

            this.canchas = res.data;

            if (this.canchas[0].tipo === 'Fútbol/Futsal' || this.canchas[0].tipo === 'Mixto') {
              this.tipo_cancha = 'futbol';
            } else {
              this.tipo_cancha = 'voley';
            }

            this.click_ver(res.data[0]._id);

            this.load_data = false;
          },
          error: (err) => {
            this.canchas = [];
          }
        });
      }
    });
  }

  click_ver(id: any) {
    this.botonesHoras = [];
    this.load_btn_ver = true;
    this.ver_caracteristicas = !this.ver_caracteristicas;
    this._userService.obtener_cancha_publico(id).subscribe({
      next: (res) => {
        this.cancha_ver = res.data;

        this._userService
          .obtener_reservaciones_public(this.cancha_ver._id)
          .subscribe((response) => {
            this.reservaciones = response.data;
            this.inicializarBotonesHoras();
          });

        this.load_btn_ver = false;
      },
      error: (err) => {
        this.cancha_ver = {};
      }
    });
    localStorage.clear();
    localStorage.setItem('id_cancha', id);
  }
}