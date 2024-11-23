import { Component, OnInit } from '@angular/core';
import { GLOBAL } from '../../../../services/global';
import { io, Socket } from 'socket.io-client';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../../../services/user.service';
import { ToastService } from '../../../../services/toast.service';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { initFlowbite, Modal, ModalInterface, ModalOptions } from 'flowbite';

@Component({
  selector: 'app-reservaciones',
  templateUrl: './reservaciones.component.html',
  styleUrl: './reservaciones.component.css'
})
export class ReservacionesComponent implements OnInit {
  public empresa: any = {};
  public token: any;
  public id: any;
  public load_data = false;
  public load_btn = false;
  public exist_res = true;
  public filtro_cod = '';
  public err_msg = false;
  public filtro = false;
  public reservaciones: Array<any> = [];
  public reservacionesOcupadas: Array<any> = [];
  public reservacionesOtras: Array<any> = [];
  public reservacion: any = {};
  p: number = 1;

  private reservacionesOtrasSubject = new BehaviorSubject<any[]>([]);
  public reservacionesOtras$ = this.reservacionesOtrasSubject.asObservable();
  public originalreservacionesOtras: any[] = [];
  public searchreservacionesOtras: any[] = [];

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  public search = '';

  public url_socket = GLOBAL.url_socket;
  private socket: Socket;

  public exist_susc = true;
  public viewButton: boolean = false;
  public activePagos: boolean = false;
  public suscripciones: Array<any> = [];
  private modals: { [key: string]: ModalInterface } = {};

  constructor(
    private _router: Router,
    private _title: Title,
    private _userService: UserService,
    private _toastrService: ToastService
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
    this._title.setTitle('GRASS | Mis reservaciones');

    this.init_data();
    this.socket.on('mostrar-reservas', () => {
      this.init_data();
    });

    this.initializeModals();

    this.searchSubject.pipe(
      debounceTime(300), // Espera 300ms después del último keyup
      distinctUntilChanged(), // Solo emite si el valor ha cambiado
      takeUntil(this.destroy$) // Se desuscribe cuando el componente se destruye
    ).subscribe(value => {
      this.performSearch(value);
    });
  }

  initializeModals() {
    // Inicializar las opciones del modal
    const modalOptions: ModalOptions = {
      placement: 'center',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
      closable: true
    };

    // Inicializar los modales después de que los datos estén cargados
    setTimeout(() => {
      this.reservacionesOtras.forEach(item => {
        const modalElement = document.getElementById(`modal-${item._id}`);
        if (modalElement) {
          this.modals[item._id] = new Modal(modalElement, modalOptions);
        }
      });
    }, 100);
  }

  openModal(id: string) {
    if (this.modals[id]) {
      this.modals[id].show();
    }
  }

  closeModal(id: string) {
    if (this.modals[id]) {
      this.modals[id].hide();
    }
  }

  init_data() {
    this.load_data = true;

    this.filtro_cod = '';
    this.filtro = false;

    this._userService.obtener_empresa(this.id, this.token).subscribe(
      response => {
        if (response.data == undefined) {
          this._toastrService.showToast('Usuario inexistente');
          this.load_data = false;
        } else {
          this.empresa = response.data;

          this._userService.obtener_reservaciones_empresa(this.empresa._id, this.token).subscribe(
            response => {
              if (response.data == undefined) {
                this.exist_res = false;
              } else {
                this.exist_res = true;
                this.reservaciones = response.data;
                this.initializeModals();

                // Separar las reservaciones en dos arreglos
                this.reservacionesOcupadas = this.reservaciones.filter(res => res.estado === 'Ocupado');
                console.log(this.reservacionesOcupadas);
                this.reservacionesOtras = this.reservaciones.filter(res => res.estado !== 'Ocupado');

                this.reservacionesOtras = [...response.data]; // Guardamos copia original
                this.updateReservacionesOtras(this.reservacionesOtras);
              }
            }
          );

          this._userService.obtener_suscripciones_empresa(this.empresa._id, this.token).subscribe(
            response => {
              if (response.data == undefined) {
                this.exist_susc = false;
                this.viewButton = true;
                this.activePagos = false;
              } else {
                this.exist_susc = true;
                this.suscripciones = response.data;

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
              }
            }
          );

          this.load_data = false;
        }
      }
    );
  }

  private updateReservacionesOtras(reservas: any[]): void {
    this.reservacionesOtras = [...reservas];
    this.reservacionesOtrasSubject.next(this.reservacionesOtras);
  }

  //Filtrar por nombre busqueda en la BDDD
  onSearchChange(event: any) {
    const value = event.target.value;
    this.searchSubject.next(value);
  }

  // Método que realiza la búsqueda
  private performSearch(value: string) {
    if (value === '') {
      this.updateReservacionesOtras(this.reservaciones);
      return;
    }

    this.load_data = true;

    this.searchreservacionesOtras = this.reservacionesOtras.filter(item => {
      const nombres = item.cliente.nombres.toLowerCase();
      const codigo = item.codigo.toLowerCase();
      return nombres.includes(value.toLowerCase()) || codigo.includes(value.toLowerCase());
    });

    this.updateReservacionesOtras(this.searchreservacionesOtras);
    this.load_data = false;
  }

  filtrar_cod() {
    if (this.filtro_cod == '') {
      this.err_msg = false;
      this.filtro = false;
      this.init_data();
    } else {
      this._userService.obtener_reservacion_empresa(this.filtro_cod, this.token).subscribe(
        response => {
          if (response.data != undefined) {
            this.err_msg = false;
            this.reservacion = response.data;
            this.filtro = true;
          } else {
            this.err_msg = true;
            this.init_data();
            this.reservacion = {};
          }
        }
      );
    }
  }

  eliminar_reservacion(id: any) {
    this.load_btn = true;
    this._userService.eliminar_reservacion_empresa(id, this.token).subscribe(
      response => {
        this._toastrService.showToast('Se eliminó con éxito');

        this.load_btn = false;
        this.init_data();
      }
    );
  }

  confirmar_reservacion(id: any) {
    this.load_btn = true;
    this._userService.actualizar_reserva_reservado_empresa(id, this.token).subscribe(
      response => {
        this._toastrService.showToast('Se confirmó con éxito');
        this.socket.emit('confirmar-reserva-admin', { data: true });
        this.load_btn = false;
        this.init_data();
      }
    );
  }

  actualizar_reserva_total_grass(id: string, total: number) {
    this._userService.actualizar_reserva_total_grass(id, total, this.token).subscribe({
      next: (res) => {
        this.init_data();
      },
      error: (err) => {

      }
    });
  }

  calcularPrecioMixto(item: any): number {
    const horasDia = item.cancha.hora_noche - item.hora_inicio;
    const horasNoche = item.hora_fin - item.cancha.hora_noche;
    return (horasDia * item.cancha.precio_dia) + (horasNoche * item.cancha.precio_noche);
  }
}