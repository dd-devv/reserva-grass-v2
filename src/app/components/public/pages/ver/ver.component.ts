import { Component, OnInit } from '@angular/core';
import { GLOBAL } from '../../../../services/global';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

interface BotonHora {
  estado: string;
  fecha: Date;
  hora: string;
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
  public load_btn_ver = false;
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

  constructor(
    private _router: Router,
    private _userService: UserService,
    private _title: Title,
    private _toastrService: ToastrService
  ) {
    this.url = GLOBAL.url;
    const ruta = _router.url.split('/');
    this.path = ruta[ruta.length - 1];
    this.init_data();
  }

  ngOnInit(): void {
    this._title.setTitle('Ver Canchas');
    this.horasReserva = 1;
    this.fechaSeleccionada = new Date();
    this.inicializarBotonesHoras();
  }

  handleIdcatalogos(tipo_cancha: string) {
    this.tipo_cancha = tipo_cancha;
  }

  private inicializarBotonesHoras() {
    this.botonesHoras = [];
    const ahora = new Date(this.fechaSeleccionada!);
    const primerHora = ahora.getHours();

    for (let j = primerHora; j < 24; j++) {
      const inicio = j < 10 ? `0${j}` : `${j}`;
      const fecha = new Date(ahora);
      const hora = inicio;

      const esDiaActual = ahora.getDate() === this.ahora.getDate();
      const est: string =
        esDiaActual && ahora.getHours() >= j ? 'Pasado' : 'Libre';
      const disponible = esDiaActual ? ahora.getHours() < j : true;

      const id = `00${j}`.slice(-4); // Asegurar que el ID tenga cuatro dígitos
      const boton: BotonHora = { estado: est, fecha, hora, disponible, id };
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
      localStorage.setItem('hora_inicio', boton.hora);
      localStorage.setItem('hora_fin', this.botonesHoras[index + this.horasReserva - 1]?.hora ?? boton.hora);
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

        this._userService.obtener_canchas(this.empresa._id).subscribe((response) => {
          if (response.data == undefined) {
            this.load_data = false;
          } else if (response.data != undefined) {
            this.canchas = response.data;

            if (this.canchas[0].tipo === 'Fútbol/Futsal' || this.canchas[0].tipo === 'Mixto') {
              this.tipo_cancha = 'futbol';
            } else {
              this.tipo_cancha = 'voley';
            }

            this.load_data = false;
            this.click_ver(response.data[0]._id);
          }
        });
      }
    });
  }

  click_ver(id: any) {
    this.botonesHoras = [];
    this.load_btn_ver = true;
    this.ver_caracteristicas = !this.ver_caracteristicas;

    this._userService.obtener_cancha_publico(id).subscribe((response) => {
      if (response === undefined) {
        this.cancha_ver = undefined;
        this.load_btn_ver = false;
      } else {
        this.cancha_ver = response.data;

        this._userService
          .obtener_reservaciones_public(this.cancha_ver._id)
          .subscribe((response) => {
            this.reservaciones = response.data;
            this.inicializarBotonesHoras();
          });

        this.load_btn_ver = false;
      }
    });
    localStorage.clear();
    localStorage.setItem('id_cancha', id);
  }

  click_ver_movil(id: any) {
    localStorage.clear();
    localStorage.setItem('id_cancha', id);
  }
}