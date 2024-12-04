import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast/toast.service';
import { UserService } from '../../../services/user.service';
import { Datepicker, DatepickerOptions, initFlowbite } from 'flowbite';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-card-horario-empresa',
  templateUrl: './card-horario-empresa.component.html',
  styleUrl: './card-horario-empresa.component.css'
})
export class CardHorarioEmpresaComponent implements OnInit, AfterViewInit {
  @Input() tipo!: string;
  @Input() botonesHoras!: any[];
  @Input() cancha!: any;
  @Input() hora_fin!: number;
  @Output() fechaSeleccionada = new EventEmitter<Date>();
  @Output() reservacionCreada = new EventEmitter<boolean>();

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
  public nombre_cliente = '';
  public tipo_cancha = 'futbol';
  public telefono_cliente = '';
  public reservacion: any = {};
  public load_reserva = true;

  public url_socket = environment.url_socket;
  private socket: Socket;

  isModalVisible: boolean = false;

  showModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }

  constructor(
    private _router: Router,
    private toastService: ToastService,
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

    this.socket = io(environment.url_socket, {
      path: environment.socketPath
    });
    this.socket.on('connect', () => {
    });
  }

  ngOnInit(): void {
    this.precio_reservacion = this.cancha.precio_reservacion;
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
    this.toastService.warning('No se pueden agregar más horas. Excede el horario de cierre.');
  }

  resetHoras() {
    this.cantidad_horas = 1;
    this.precio_reservacion = this.cantidad_horas * this.cancha.precio_reservacion;
  }

  changeHoras(hora: number, cant: number) {
    const nuevaHoraFinal = hora + this.cantidad_horas + cant;
    if (nuevaHoraFinal <= this.hora_fin) {
      this.hora_inicio = hora;
      this.cantidad_horas += cant;
      this.precio_reservacion = this.cantidad_horas * this.cancha.precio_reservacion;
    } else {
      this.mostrarToast();
      console.log('No se pueden agregar más horas. Excede el horario de cierre.');
    }
  }

  onHoraSeleccionada(hora: any) {

    if (hora.estado === 'Libre') {
      if (this.nombre_cliente !== '' || this.telefono_cliente !== '') {
        let data = {
          empresa: this.id_user,
          cancha: this.cancha._id,
          estado: 'Reservado',
          nombre: this.nombre_cliente,
          telefono: this.telefono_cliente,
          subtotal: this.precio_reservacion || this.cantidad_horas * this.cancha.precio_reservacion,
          fecha: hora.fecha.toDateString(),
          hora_inicio: hora.hora,
          hora_fin: hora.hora + this.cantidad_horas,
          tipo_cancha: this.tipo
        }

        if (this.cancha.tipo === 'Mixto') {
          data.tipo_cancha = this.tipo_cancha;
        }

        this._userService.registro_reservacion_grass(data, this.token).subscribe({
          next: (res) => {
            this.toastService.success('Se reservó con éxito');
            this.socket.emit('crear-reserva-grass', { data: true });
            this.reservacionCreada.emit(true);
          },
          error: (err) => {
            this.toastService.error(err.error.message);
          }
        });
        
      } else {
        this.toastService.success('Completa todos los campos');
      }
    } else {
      this.toastService.success('Hora ya ocupada');
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

  obtener_reservacion(id: string) {
    this.load_reserva = true;
    this._userService.obtener_reservacion_empresa(id, this.token).subscribe({
      next: (res) => {
        this.reservacion = res.data;
        this.load_reserva = false;
      },
      error: (err) => {
        this.reservacion = {};
      }
    }
    );
  }

  confirmar_reservacion(id: string) {
    this._userService.actualizar_reserva_reservado_empresa(id, this.token).subscribe({
      next: (res) => {
        this.toastService.success('Se confirmó con éxito');
        this.socket.emit('confirmar-reserva-admin', { data: true });
        this.reservacionCreada.emit(true);
      }
    });
  }
}