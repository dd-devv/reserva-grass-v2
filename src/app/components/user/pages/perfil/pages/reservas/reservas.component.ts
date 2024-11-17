import { Component, Input, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { UserService } from '../../../../../../services/user.service';
import { Title } from '@angular/platform-browser';
import { ToastService } from '../../../../../../services/toast.service';
import { io, Socket } from 'socket.io-client';
import { GLOBAL } from '../../../../../../services/global';
import html2canvas from 'html2canvas';

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
  p: number = 1;

  public url_socket = GLOBAL.url_socket;
  private socket: Socket;

  constructor(
    private _userService: UserService,
    private _title: Title,
    private _toastrService: ToastService
  ) {

    this.idCancha = localStorage.getItem('id_cancha');
    this.fecha = localStorage.getItem('fecha_reserva');
    this.horaInicio = localStorage.getItem('hora_inicio');
    this.horaFin = localStorage.getItem('hora_fin');
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

    this.socket = io(GLOBAL.url_socket, {
      path: '/socket.io'
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
        this.calcular_subtotal();
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

  calcular_subtotal() {
    this.subtotal = (parseInt(this.horaFin!) - parseInt(this.horaInicio!)) * this.cancha.precio_reservacion;
  }

  async copiar_portapapeles(id: string) {
    try {
      await navigator.clipboard.writeText(id);
      this._toastrService.showToast('Copiado al portapapeles!');
    } catch (err) {
      this._toastrService.showToast('No se pudo copiar al portapapeles.');
    }
  }

  async copiar_ubicacion_portapapeles(ubicacion: string) {
    try {
      await navigator.clipboard.writeText(`La ubicación de la cancha es ${ubicacion}`);
      this._toastrService.showToast('Direccion copiado!');
    } catch (err) {
      this._toastrService.showToast('No se pudo copiar al portapapeles.');
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
          this._toastrService.showToast(response.message);
        } else {
          this._toastrService.showToast('Se reservó con éxito');
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
        // Crear un nuevo canvas solo para el contenido capturado
        const combinedCanvas = document.createElement('canvas');
        combinedCanvas.width = contentCanvas.width;
        combinedCanvas.height = contentCanvas.height;

        const ctx = combinedCanvas.getContext('2d')!;

        // Dibujar el contenido capturado
        ctx.drawImage(contentCanvas, 0, 0);

        // Obtener la imagen capturada como una URL
        const combinedImage = combinedCanvas.toDataURL('image/png');

        // Crear un elemento a para la descarga
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
