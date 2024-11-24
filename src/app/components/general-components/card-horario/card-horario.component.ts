import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Datepicker, initFlowbite } from 'flowbite';
import type { DatepickerOptions } from 'flowbite';
import { ToastService } from '../../../services/toast/toast.service';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { GLOBAL } from '../../../services/global';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-card-horario',
  templateUrl: './card-horario.component.html',
  styleUrls: ['./card-horario.component.css']
})
export class CardHorarioComponent implements OnInit, AfterViewInit {
  @Input() tipo!: string;
  @Input() botonesHoras!: any[];
  @Input() cancha!: any;
  @Input() hora_fin!: number;
  @Output() fechaSeleccionada = new EventEmitter<Date>();

  fechaMinima: string = '';
  fechaMaxima: string = '';
  datepicker: any;

  public hora_inicio = 0;
  public cantidad_horas = 1;
  public precio_reservacion = 10;

  public isUser = false;
  public id_user: any;
  public token: any;
  public user_lc: any;

  public url_socket = GLOBAL.url_socket;
  private socket: Socket;

  constructor(
    private _router: Router,
    private toastService: ToastService,
    private _authService: AuthService,
    private _userService: UserService
  ) {
    const hoy = new Date();
    this.fechaMinima = this.formatearFecha(hoy);

    this.id_user = localStorage.getItem('_id') || sessionStorage.getItem('_id');
    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.user_lc = JSON.parse(localStorage.getItem('user_data')!);

    const unMesDespues = new Date();
    unMesDespues.setMonth(unMesDespues.getMonth() + 1);
    this.fechaMaxima = this.formatearFecha(unMesDespues);


    this.socket = io(GLOBAL.url_socket, {
      path: '/socket.io'
    });
    this.socket.on('connect', () => {
    });
  }



  ngOnInit(): void {
    this.precio_reservacion = this.cancha.precio_reservacion;
    this.isUser = this._authService.isAuthenticatedUser();
  }

  ngAfterViewInit(): void {
    // Esperamos a que el DOM esté listo y los datos cargados
    setTimeout(() => {
      this.inicializarDatepicker();
      this.inicializarFlowbite();
    }, 100);
  }

  private inicializarFlowbite(): void {
    initFlowbite();
  }

  private inicializarDatepicker(): void {
    const targetEl = document.getElementById('datepicker-format');

    if (targetEl) {
      const options: DatepickerOptions = {
        minDate: this.fechaMinima,
        maxDate: this.fechaMaxima,
        autohide: true,
        format: 'dd/mm/yyyy',
        title: "prueba",
        autoSelectToday: 1

      };

      this.datepicker = new Datepicker(targetEl, options);

      // Agregar el evento change al input
      targetEl.addEventListener('changeDate', (event: any) => {
        if (event.detail && event.detail.date) {
          this.fechaSeleccionada.emit(event.detail.date);
        }
      });
    }
  }
  mostrarToast() {
    this.toastService.success('No se pueden agregar más horas. Excede el horario de cierre.');
  }

  changeHoras(hora: number, cant: number) {
    const nuevaHoraFinal = hora + this.cantidad_horas + cant;
    if (nuevaHoraFinal <= this.hora_fin) {
      this.hora_inicio = hora;
      this.cantidad_horas += cant;
    } else {
      this.mostrarToast();
      console.log('No se pueden agregar más horas. Excede el horario de cierre.');
    }
  }

  onHoraSeleccionada(hora: any) {
    hora.estado === 'Libre' ? 'Reservado' : 'Libre';

    if (this.isUser) {
      let data = {
        empresa: this.cancha.empresa._id,
        cancha: this.cancha._id,
        cliente: this.id_user,
        subtotal: this.cantidad_horas * this.cancha.precio_reservacion,
        fecha: hora.fecha.toDateString(),
        hora_inicio: hora.hora,
        hora_fin: hora.hora + this.cantidad_horas
      }
      this._userService.crear_reservacion_user(data, this.token).subscribe({
        next: (res) => {
          this.toastService.success('Se reservó con éxito');
          this.socket.emit('crear-reserva-ocupado', { data: true });
          this._router.navigate(['/usuario/perfil/reservas']);
        },
        error: (err) => {
          this.toastService.success(err.error.message || 'No se pudo registrar, intete de nuevo');

          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      });
    } else {
      localStorage.setItem('fecha_reserva', hora.fecha.toDateString());
      localStorage.setItem('hora_inicio', hora.hora.toString());
      localStorage.setItem('hora_fin', (hora.hora + this.cantidad_horas).toString());
      localStorage.setItem('afuera', 'Y');
      this._router.navigate(['/auth']);
    }

  }

  private formatearFecha(fecha: Date): string {
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
  }

  // Si los datos cambian después de la carga inicial
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['botonesHoras'] && !changes['botonesHoras'].firstChange) {
      setTimeout(() => {
        this.inicializarFlowbite();
      }, 100);
    }
  }
}