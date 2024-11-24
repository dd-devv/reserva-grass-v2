import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { Title } from '@angular/platform-browser';
import { ToastService } from '../../../../services/toast/toast.service';
import { GLOBAL } from '../../../../services/global';
import Chart from 'chart.js/auto';
import { io, Socket } from 'socket.io-client';

interface BotonHora {
  estado: string;
  fecha: Date;
  hora: number;
  disponible: boolean;
  id: string;
  id_reserva?: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  public empresa: any = {};
  public chart: any;
  public cantidad = 0;
  public total_ventas = 0;
  public total_mes = 0;
  public total_mes_anterior = 0;
  public total_mes_sim = 0;
  public total_mes_anterior_sim = 0;
  public count_ventas = 0;
  public load_data = true;
  public id: any;
  public token: any;
  public load_btn = false;
  public url: any;
  public load_btn_eliminar = false;
  public file: File | any = undefined;
  public colores = ['rgb(20, 203, 139)', 'rgb(169, 19, 249)', 'rgb(249, 84, 183)', 'rgb(20, 120, 252)', 'rgb(255, 124, 25)'];
  public canchas: Array<any> = [];

  public exist_susc = true;
  public viewButton: boolean = false;
  public activePagos: boolean = false;
  public suscripciones: Array<any> = [];

  public tipo_cancha = 'futbol';
  public hora_inicio = 0;
  public hora_fin = 0;
  public fecha = '';
  public id_cancha = '';
  public load_btn_ver = true;
  public reservaciones: any = [];
  public cancha_ver: any = {};
  public horasReserva: number = 1;
  botonesHoras: BotonHora[] = [];
  fechaSeleccionada: Date | null = null;

  ahora: Date = new Date();

  public url_socket = GLOBAL.url_socket;
  private socket: Socket;

  constructor(
    private _userService: UserService,
    private _title: Title,
    private _toastrService: ToastService
  ) {
    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');
    this.url = GLOBAL.url;

    this.socket = io(GLOBAL.url_socket, {
      path: '/socket.io'
    });
    this.socket.on('connect', () => {
    });
  }

  ngOnInit(): void {
    this._title.setTitle('GRASS | Galería de canchas');
    this.init_chart();
    this.init_data();
    this.inicializarBotonesHoras();

    this.socket.on('mostrar-reservas-user', () => {
      this.init_data();
    });
  }

  init_data() {
    this.file = null;
    this.fechaSeleccionada = new Date();
    this._userService
      .obtener_empresa(this.id, this.token)
      .subscribe({
        next: (res) => {
          this.empresa = res.data;
          this.hora_inicio = this.empresa.hora_inicio;
          this.hora_fin = this.empresa.hora_fin;

          this._userService.obtener_suscripciones_empresa(this.empresa._id, this.token).subscribe(
            {
              next: (resp) => {
                this.exist_susc = true;
                this.suscripciones = resp.data;

                for (let i = 0; i < this.suscripciones.length; i++) {
                  if (this.suscripciones[i].estado == 'Confirmado') {
                    this.activePagos = true;
                    this.viewButton = false;
                    break;
                  } else {
                    this.activePagos = false;
                  }
                }

                if (this.suscripciones.at(0).estado !== 'Confirmado') {
                  this.viewButton = true;
                  this.activePagos = false;
                }
              },
              error: (errr) => {
                this.exist_susc = false;
                this.viewButton = true;
                this.activePagos = false;
              }
            });

          this._userService.obtener_canchas_empresa(this.id, this.token).subscribe({
            next: (res) => {

              this.canchas = res.data;
              this.id_cancha = this.canchas[0]._id;

              if (this.canchas[0].tipo === 'Fútbol/Futsal' || this.canchas[0].tipo === 'Mixto') {
                this.tipo_cancha = 'futbol';
              } else {
                this.tipo_cancha = 'voley';
              }

              this.click_ver(this.id_cancha);

              this.load_data = false;
            },
            error: (err) => {
              this.canchas = [];
            }
          });

          this.load_data = false;
        },
        error: (err) => {
          this.empresa = undefined;
          this.load_data = false;
        }
      });
  }

  init_chart() {
    this._userService.obtener_canchas_empresa(this.id, this.token).subscribe(
      canchasResponse => {
        this.canchas = canchasResponse.data;

        // Objeto para almacenar datos de todas las canchas
        const datasets: any = [];

        // Iterar sobre cada cancha
        this.canchas.forEach((cancha, index) => {
          this._userService.kpi_ganancias_mensuales_grass(cancha._id, this.token).subscribe(
            response => {
              // Obtener color dinámicamente del arreglo de colores
              const color = this.colores[index % this.colores.length];

              // Almacenar resultados de cada cancha con el color correspondiente
              const canchaData = {
                label: cancha.nombre,
                data: [response.enero, response.febrero, response.marzo, response.abril, response.mayo, response.junio, response.julio, response.agosto, response.septiembre, response.octubre, response.noviembre, response.diciembre],
                backgroundColor: color,
                borderColor: color,
                tension: 0.4
              };

              this.count_ventas += response.count_ventas;

              datasets.push(canchaData);

              // Crear el gráfico después de obtener todos los datos
              if (datasets.length === this.canchas.length) {
                this.createChart(datasets);
              }
            }
          );
        });
      }
    );
  }

  createChart(datasets: any) {
    // Crear el gráfico con todos los datos de las canchas
    this.chart = new Chart("MyChart", {
      type: 'line',
      data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: datasets
      },
      options: {
        aspectRatio: 2
      }
    });

    this.load_data = false;
  }

  handleFecha(fecha: any) {
    this.fecha = fecha;
    this.fechaSeleccionada = fecha;

    this.inicializarBotonesHoras();
  }

  handleReservado(creado: boolean) {
    if (creado) {
      this.inicializarBotonesHoras();
      this.init_data();
    }
  }

  onRadioChange(tipo: string, id: string) {
    if (tipo === 'Fútbol/Futsal' || tipo === 'Mixto') {
      this.tipo_cancha = 'futbol';
    } else {
      this.tipo_cancha = 'voley';
    }

    this.click_ver(id);
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
      let idReserva = '';
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
              idReserva = reservacion._id;
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
        id_reserva: idReserva,
        hora: parseInt(horaFormateada),
        disponible: disponibleBtn,
        id
      };

      this.botonesHoras.push(boton);
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

  click_ver(id: any) {
    this.botonesHoras = [];
    this.load_btn_ver = true;
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
  }
}
