import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../../../services/user.service';
import { ToastService } from '../../../../services/toast/toast.service';
import { Modal } from 'flowbite';

@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html',
  styleUrl: './cuentas.component.css'
})
export class CuentasComponent implements OnInit {
  public token;
  public id;
  public cuentas: Array<any> = [];
  public load_btn = false;
  public btn_crear = false;
  public load_data = true;
  private modales: { [key: string]: Modal } = {}; // Objeto para almacenar múltiples modales
  private modalCrear: Modal | null = null;

  public cuenta: any = {
    banco: '',
    color: '#FFFFFF'
  };
  public bancos = ['yape', 'plin', 'bcp', 'interbank', 'nacion', 'bbva'];
  public colores = ['#9061f9', '#72eade', '#ff5a1f', '#25c26b', '#f05656', '#56dbdb'];
  public colores_fondo = ['#f6f2ff', '#f7fffe', '#fff4f0', '#f7fffb', '#fff2f2', '#f2ffff'];
  public esCuenta = true;
  public limiteCuenta = 20;

  constructor(
    private _title: Title,
    private _userService: UserService,
    private _toastrService: ToastService
  ) {
    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');
  }

  ngOnInit(): void {
    this._title.setTitle('GRASS | Cuentas');
    this.init_data();
    this.initModalCrear();
  }

  ngAfterViewInit(): void {
    // Inicializar los modales después de que los datos se hayan cargado
    setTimeout(() => {
      this.initModalesEliminar();
    }, 100);
  }

  private initModalCrear(): void {
    const modalElement = document.getElementById('crearCanchaModal');
    if (modalElement) {
      this.modalCrear = new Modal(modalElement);
    }
  }

  private initModalesEliminar(): void {
    // Inicializar un modal para cada cuenta
    this.cuentas.forEach(cuenta => {
      const modalId = `modal-${cuenta._id}`;
      const modalElement = document.getElementById(modalId);
      if (modalElement) {
        this.modales[modalId] = new Modal(modalElement);
      }
    });
  }

  openModalEliminar(cuentaId: string): void {
    const modalId = `modal-${cuentaId}`;
    if (this.modales[modalId]) {
      this.modales[modalId].show();
    }
  }

  closeModalEliminar(cuentaId: string): void {
    const modalId = `modal-${cuentaId}`;
    if (this.modales[modalId]) {
      this.modales[modalId].hide();
    }
  }

  openModalCrear(): void {
    if (this.modalCrear) {
      this.modalCrear.show();
    }
  }

  closeModalCrear(): void {
    if (this.modalCrear) {
      this.modalCrear.hide();
    }
  }

  init_data() {
    this.cuentas = [];
    this.load_data = true;
    this._userService.obtener_cuentas_grass(this.id, this.token).subscribe({
      next: (res) => {
        if (res.data.length == 0) {
          this.load_data = false;
          this.btn_crear = true;
        } else {
          this.cuentas = res.data;
          this.load_data = false;
          this.btn_crear = false;
          // Inicializar los modales después de cargar los datos
          setTimeout(() => {
            this.initModalesEliminar();
          }, 100);
        }
      },
      error: (res) => {
        this.load_data = false;
        this.btn_crear = true;
      }
    });
  }

  public actualizarColor(): void {
    const indice = this.bancos.indexOf(this.cuenta.banco);
    if (indice !== -1) {
      this.cuenta.color = this.colores[indice];
      this.cuenta.fondo = this.colores_fondo[indice];
    } else {
      this.cuenta.color = '#000000';
      this.cuenta.fondo = '#FFFFFF';
    }
  }

  public onBancoChange(): void {
    this.actualizarColor();
    if (this.cuenta.banco == 'Yape' || this.cuenta.banco == 'Plin') {
      this.esCuenta = false;
      this.limiteCuenta = 9;
    } else {
      this.esCuenta = true;
      this.limiteCuenta = 20;
    }
  }

  registro(registroForm: any) {
    this.cuenta.empresa = this.id;
    if (registroForm.valid) {
      this.load_btn = true;
      this._userService.registro_cuenta_grass(this.cuenta, this.token).subscribe({
        next: (res) => {
          this._toastrService.success('Se registró con éxito');
          this.closeModalCrear();
          this.init_data();
        },
        error: (err) => {
          this._toastrService.error('Error');
        }
      });
    }
  }

  eliminar(id: any) {
    this.load_btn = true;
    this._userService.eliminar_cuenta_grass(id, this.token).subscribe(
      response => {
        this._toastrService.success('Se eliminó con éxito');
        this.closeModalEliminar(id);
        this.load_btn = false;
        this.init_data();
      }
    );
  }
}