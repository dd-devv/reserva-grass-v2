import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { GLOBAL } from '../../../../services/global';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-cancha',
  templateUrl: './cancha.component.html',
  styleUrl: './cancha.component.css'
})
export class CanchaComponent implements OnInit, OnDestroy {
  id: string;
  url = GLOBAL.url;
  load_data = false;
  load_btn_ver = false;
  width_view = true;
  btn_crear = false;
  ver_caracteristicas = false;
  canchas: any[] = [];
  reservaciones: any[] = [];
  cancha_ver: any = {};
  empresa: any = {};
  horasInicio = 0;
  horasFinal = 0;
  horasReserva = 1;
  masDeUno = false;
  diasSemana: { nombre: string; fecha: Date }[] = [];
  intervalosHorarios: { inicio: string; fin: string }[] = [];
  botonesHoras: BotonHora[][] = [];
  screenWidth: number;
  screenHeight: number;
  ahora = new Date();
  
  private subscriptions: Subscription[] = [];

  @HostListener('window:resize')
  onResize() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.width_view = this.screenWidth >= this.screenHeight;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private titleService: Title,
    private toastrService: ToastrService
  ) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.width_view = this.screenWidth >= this.screenHeight;
    this.id = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.titleService.setTitle('Ver Canchas');
    this.init_data();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private calcularDiasSemana(): void {
    this.diasSemana = Array.from({ length: 8 }, (_, i) => {
      const dia = new Date(this.ahora);
      dia.setDate(this.ahora.getDate() + i);
      return {
        nombre: dia.toLocaleDateString('es-ES', { weekday: 'long' }).slice(0, 3),
        fecha: dia,
      };
    });
  }

  private calcularIntervalosHorarios(): void {
    this.intervalosHorarios = Array.from({ length: 19 }, (_, i) => {
      const hora = i + 5;
      return {
        inicio: `${hora.toString().padStart(2, '0')}:00`,
        fin: `${(hora + 1).toString().padStart(2, '0')}:00`,
      };
    });
  }

  private inicializarBotonesHoras(): void {
    const primerDiaSemana = this.ahora.getDay();
    this.botonesHoras = Array.from({ length: 8 }, (_, i) =>
      Array.from({ length: 19 }, (_, j) => {
        const hora = j + 5;
        const fecha = new Date(this.ahora);
        fecha.setDate(this.ahora.getDate() + i);
        const esDiaActual = i === 0;
        const disponible = esDiaActual ? this.ahora.getHours() < hora : true;
        return {
          estado: esDiaActual && this.ahora.getHours() >= hora ? 'Pasado' : 'Libre',
          fecha,
          hora: hora.toString(),
          disponible,
          id: `${i.toString().padStart(2, '0')}${hora.toString().padStart(2, '0')}`,
        };
      })
    );
  }

  onHoraSeleccionada(filaIndex: number, columnaIndex: number): void {
    const boton = this.botonesHoras[filaIndex][columnaIndex];
    if (this.horasReserva > 4 || this.horasReserva < 1) {
      this.toastrService.error('Se permite como máximo 4 horas!', 'ERROR');
      this.horasReserva = 1;
      return;
    }

    if (this.horasFinal > 23) {
      this.toastrService.error('Solo se puede reservar hasta las 23:00!', 'ERROR');
      return;
    }

    if (boton.disponible) {
      boton.estado = boton.estado === 'Libre' ? 'Reservado' : 'Libre';
      localStorage.setItem('fecha_reserva', boton.fecha.toDateString());
      localStorage.setItem('hora_inicio', this.horasInicio.toString());
      localStorage.setItem('hora_fin', this.horasFinal.toString());
      localStorage.setItem('afuera', 'Y');
      this.router.navigate(['/login']);
    }
  }

  select_mas_una_hora(hora: string): void {
    this.horasInicio = parseInt(hora);
    this.horasFinal = this.horasInicio + this.horasReserva;
    this.masDeUno = this.horasReserva > 1;
  }

  reset_horas_reserva(): void {
    this.horasReserva = 1;
  }

  init_data(): void {
    this.load_data = true;
    this.subscriptions.push(
      this.userService.obtener_empresa_publico(this.id).subscribe(
        response => {
          if (response.data) {
            this.empresa = response.data;
            this.loadCanchas();
          } else {
            this.load_data = false;
          }
        },
        error => {
          console.error('Error al obtener empresa:', error);
          this.load_data = false;
        }
      )
    );
  }

  private loadCanchas(): void {
    this.subscriptions.push(
      this.userService.obtener_canchas(this.id).subscribe(
        response => {
          if (response.data) {
            this.btn_crear = false;
            this.canchas = response.data;
            this.click_ver(response.data[0]._id);
          } else {
            this.btn_crear = true;
          }
          this.load_data = false;
        },
        error => {
          console.error('Error al obtener canchas:', error);
          this.load_data = false;
          this.btn_crear = true;
        }
      )
    );
  }

  click_ver(id: string): void {
    this.botonesHoras = [];
    this.load_btn_ver = true;
    this.ver_caracteristicas = !this.ver_caracteristicas;

    this.subscriptions.push(
      this.userService.obtener_cancha_publico(id).subscribe(
        response => {
          if (response && response.data) {
            this.cancha_ver = response.data;
            this.loadReservaciones(id);
          } else {
            this.cancha_ver = undefined;
            this.load_btn_ver = false;
          }
        },
        error => {
          console.error('Error al obtener cancha:', error);
          this.load_btn_ver = false;
        }
      )
    );

    localStorage.clear();
    localStorage.setItem('id_cancha', id);
  }

  private loadReservaciones(id: string): void {
    this.subscriptions.push(
      this.userService.obtener_reservaciones_public(id).subscribe(
        response => {
          this.reservaciones = response.data || [];
          this.inicializarBotonesHoras();
          this.actualizarEstadoBotones();
          this.calcularDiasSemana();
          this.calcularIntervalosHorarios();
          this.load_btn_ver = false;
        },
        error => {
          console.error('Error al obtener reservaciones:', error);
          this.load_btn_ver = false;
        }
      )
    );
  }

  private actualizarEstadoBotones(): void {
    this.botonesHoras.forEach(fila => {
      fila.forEach(boton => {
        const reservacion = this.reservaciones.find(r => 
          new Date(r.fecha).toDateString() === boton.fecha.toDateString() &&
          parseInt(boton.hora) >= parseInt(r.hora_inicio) &&
          parseInt(boton.hora) < parseInt(r.hora_fin)
        );

        if (reservacion) {
          boton.estado = reservacion.estado;
          boton.disponible = false;
        }

        if (this.isHoraPasada(boton.fecha, boton.hora)) {
          boton.estado = 'Pasado';
          boton.disponible = false;
        }
      });
    });
  }

  isHoraPasada(fecha: Date, hora: string): boolean {
    const horaSeleccionada = new Date(fecha);
    horaSeleccionada.setHours(parseInt(hora, 10), 0);
    return this.ahora > horaSeleccionada;
  }

  click_ver_movil(id: string): void {
    localStorage.clear();
    localStorage.setItem('id_cancha', id);
  }
}