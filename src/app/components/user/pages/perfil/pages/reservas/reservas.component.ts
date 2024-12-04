import { Component, Input, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { UserService } from '../../../../../../services/user.service';
import { Title } from '@angular/platform-browser';
import { ToastService } from '../../../../../../services/toast/toast.service';
import { io, Socket } from 'socket.io-client';
import html2canvas from 'html2canvas';
import {jsPDF} from 'jspdf';
import { environment } from '../../../../../../../environments/environment';


@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.css'
})
export class ReservasComponent implements OnInit {

  @Input() shouldOpen: boolean = false;
  isOpen: boolean = false;
  public pagos: Array<any> = [];
  public cuentas: Array<any> = [];
  public reservaciones: Array<any> = [];
  public reservaciones_pendientes: Array<any> = [];
  public reservaciones_activas: Array<any> = [];
  public reservaciones_finalizadas: Array<any> = [];

  public load_data: boolean = true;
  public load_reservas: boolean = true;
  public load_btn = false;
  public load_cuentas = false;
  public descargando = false;
  public activePagos: boolean = false;
  public viewButton: boolean = false;

  public empresa = '';
  public telefono_empresa = '';
  public codigo_reserva = '';
  public token: any;
  public cancha: any = {};
  public user_lc: any = {};
  public afuera: any = {};
  public idCancha: any;
  public cliente: any;
  public subtotal: number = 0;
  public fecha;
  public horaInicio;
  public horaFin;
  public descuento = '';
  public fromOut: boolean = false;
  public existReservas: boolean = false;
  public myAngularxQrCode: string = '';
  currentPage = 1;
  pageSize = 8;

  public url_socket = environment.url_socket;
  private socket: Socket;

  public ver_finalizadas = false;

  constructor(
    private _userService: UserService,
    private _title: Title,
    private _toastrService: ToastService
  ) {

    this.idCancha = localStorage.getItem('id_cancha');
    this.fecha = localStorage.getItem('fecha_reserva');
    this.horaInicio = parseInt(localStorage.getItem('hora_inicio')!);
    this.horaFin = parseInt(localStorage.getItem('hora_fin')!);
    this.afuera = localStorage.getItem('afuera');
    this.cliente = localStorage.getItem('_id') || sessionStorage.getItem('_id');
    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.user_lc = JSON.parse(localStorage.getItem('user_data')!);

    this.myAngularxQrCode = 'Esto ';

    if (this.afuera === 'Y') {
      this.fromOut = true;
    } else {
      this.fromOut = false;
    }

    this.socket = io(environment.url_socket, {
      path: environment.socketPath
    });
    this.socket.on('connect', () => {
    });
  }

  ngOnInit() {
    if (this.shouldOpen) {
      this.openModal();
    }

    this._userService.obtener_cancha_publico(this.idCancha).subscribe(
      response => {
        this.cancha = response.data;
        this.load_data = false;
      }
    );

    this.obtener_reservas();

    this.socket.on('mostrar-reservas-user', () => {
      this.obtener_reservas();
      this.fromOut = false;
    });

    if (this.reservaciones.length >= 1) {
      this.existReservas = true;
    } else {
      this.existReservas = false;
    }
  }

  get totalPages(): number {
    return Math.ceil(this.reservaciones_finalizadas.length / this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  ngAfterViewInit(): void {
    // Esperamos a que el DOM esté listo y los datos cargados
    setTimeout(() => {
      this.inicializarFlowbite();
    }, 100);
  }

  private inicializarFlowbite(): void {
    initFlowbite();
  }

  openModal() {
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.isOpen = false;
    document.body.style.overflow = 'auto';
  }

  verFinalizadas() {
    this.ver_finalizadas = !this.ver_finalizadas;
  }

  async copiar_portapapeles(id: string) {
    try {
      await navigator.clipboard.writeText(id);
      this._toastrService.success('Copiado al portapapeles!');
    } catch (err) {
      this._toastrService.error('No se pudo copiar al portapapeles.');
    }
  }

  async copiar_ubicacion_portapapeles(ubicacion: string) {
    try {
      await navigator.clipboard.writeText(`La ubicación de la cancha es ${ubicacion}`);
      this._toastrService.success('Direccion copiado!');
    } catch (err) {
      this._toastrService.error('No se pudo copiar al portapapeles.');
    }
  }

  obtener_cuentas_grass(id: any) {
    this.load_cuentas = true;
    this._userService.obtener_cuentas_de_grass(id, this.token).subscribe({
      next: (res) => {
        this.cuentas = res.data;
        this.load_cuentas = false;
      },
      error: (err) => {
        this.cuentas = [];
        this.load_cuentas = false;
      }
    }
    );
  }

  obtener_reservas() {
    this.load_reservas = true;
    this._userService.obtener_reservaciones_user(this.cliente, this.token).subscribe({
      next: (res) => {
        this.reservaciones = res.data;
        this.reservaciones_pendientes = [];
        this.reservaciones_activas = [];
        this.reservaciones_finalizadas = [];

        this.reservaciones.forEach(reserva => {
          switch (reserva.estado) {
            case 'Ocupado':
              this.reservaciones_pendientes.push(reserva);
              this.obtener_cuentas_grass(this.reservaciones[0].empresa._id);
              this.telefono_empresa = this.reservaciones[0].empresa.telefono;
              this.codigo_reserva = this.reservaciones[0].codigo;
              this.isOpen = true;
              break;
            case 'Reservado':
              this.reservaciones_activas.push(reserva);
              break;
            case 'Finalizado':
              this.reservaciones_finalizadas.push(reserva);
              break;
          }
        });

        let prosPend = this.procesarReservaciones(this.reservaciones_pendientes);
        this.reservaciones_pendientes = prosPend;
        let prosAct = this.procesarReservaciones(this.reservaciones_activas);
        this.reservaciones_activas = prosAct;

        this.load_reservas = false;
      },
      error: (err) => {
        this.reservaciones = [];
        this.reservaciones_pendientes = [];
        this.reservaciones_activas = [];
        this.reservaciones_finalizadas = [];
        this.load_reservas = false;
      }
    });
  }


  private procesarReservaciones(reservaciones: any) {
    return reservaciones.map((reservacion: any) => {
      // Clonar la reservación para no modificar el objeto original
      const reservacionProcesada = JSON.parse(JSON.stringify(reservacion));

      // Extraer información relevante
      const {
        cancha,
        hora_inicio,
        hora_fin,
        tipo_cancha
      } = reservacionProcesada;

      // Determinar los precios según el tipo de cancha y condiciones
      let precioHoraDia, precioHoraNoche;

      // Manejar canchas mixtas
      if (cancha.tipo === 'Mixto') {
        if (tipo_cancha === 'voley') {
          precioHoraDia = cancha.precio_dia_voley;
          precioHoraNoche = cancha.precio_noche_voley;
        } else {
          precioHoraDia = cancha.precio_dia;
          precioHoraNoche = cancha.precio_noche;
        }
      } else {
        // Canchas no mixtas
        precioHoraDia = cancha.precio_dia;
        precioHoraNoche = cancha.precio_noche;
      }

      // Determinar la hora noche de la cancha
      const horaNoche = cancha.hora_noche || 18;

      // Calcular total a pagar
      let totalPagar = 0;
      let duracionReserva = hora_fin - hora_inicio - 1;
      if (duracionReserva == 0) {
        duracionReserva = 1;
      }

      // Caso 1: Todas las horas son de día
      if (hora_fin <= horaNoche) {
        totalPagar = duracionReserva * precioHoraDia;
      }
      // Caso 2: Todas las horas son de noche
      else if (hora_inicio >= horaNoche) {
        totalPagar = duracionReserva * precioHoraNoche;
      }
      // Caso 3: Horas mixtas (parte día, parte noche)
      else {
        const horasDia = horaNoche - hora_inicio;
        const horasNoche = hora_fin - horaNoche;

        totalPagar = (horasDia * precioHoraDia) + (horasNoche * precioHoraNoche);
      }

      // Redondear a dos decimales
      totalPagar = Number(totalPagar.toFixed(2));

      // Calcular restante
      const restante = Number((totalPagar - reservacionProcesada.subtotal).toFixed(2));

      // Agregar campos calculados
      reservacionProcesada.total_pagar = totalPagar;
      reservacionProcesada.restante = restante;

      return reservacionProcesada;
    });
  }

  crear_reservacion() {

    this.load_btn = true;

    let data = {
      empresa: this.cancha.empresa._id,
      cancha: this.idCancha,
      cliente: this.cliente,
      subtotal: this.subtotal,
      fecha: this.fecha,
      hora_inicio: this.horaInicio,
      hora_fin: this.horaFin
    }

    this._userService.crear_reservacion_user(data, this.token).subscribe(
      response => {
        if (response.data == undefined) {
          this._toastrService.warning(response.message);
        } else {
          this._toastrService.success('Se reservó con éxito');
          this.socket.emit('crear-reserva-ocupado-out', { data: true });
          localStorage.removeItem('afuera');
          localStorage.removeItem('fecha_reserva');
          localStorage.removeItem('hora_inicio');
          localStorage.removeItem('hora_fin');
          localStorage.removeItem('id_cancha');
          this.load_btn = false;
        }
      }
    );
  }

  captureAndSaveView(id: any, codigo: string) {
    this.descargando = true;
  
    const container = document.getElementById(id);
  
    if (container) {
      // Capturar el contenido del contenedor
      html2canvas(container).then(contentCanvas => {
        // Definir un padding transparente (por ejemplo, 10px)
        const padding = 10;
  
        // Crear un nuevo canvas con el padding
        const combinedCanvas = document.createElement('canvas');
        combinedCanvas.width = contentCanvas.width + padding * 2;
        combinedCanvas.height = contentCanvas.height + padding * 2;
  
        const ctx = combinedCanvas.getContext('2d')!;
  
        // Rellenar el fondo del nuevo canvas con transparencia
        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);
  
        // Dibujar el contenido capturado dentro del canvas con el padding
        ctx.drawImage(contentCanvas, padding, padding);
  
        // Obtener la imagen capturada como una URL
        const combinedImage = combinedCanvas.toDataURL('image/png');
  
        // Crear un elemento <a> para la descarga
        const downloadLink = document.createElement('a');
        downloadLink.href = combinedImage;
        downloadLink.download = `${codigo}.png`;
  
        // Simular el clic en el enlace
        const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
        downloadLink.dispatchEvent(clickEvent);
  
        // Reiniciar la propiedad descargando después de la simulación del clic
        this.descargando = false;
      });
    } else {
      // Si no se encuentra el contenedor, también debes reiniciar la propiedad descargando
      this.descargando = false;
    }
  }

  eliminar_pre_reserva() {
    localStorage.removeItem('afuera');
    localStorage.removeItem('fecha_reserva');
    localStorage.removeItem('hora_inicio');
    localStorage.removeItem('hora_fin');
    localStorage.removeItem('id_cancha');

    window.location.reload();
  }


  

}
