import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../../../services/user.service';
import { ToastService } from '../../../../services/toast.service';
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
  private modal: Modal | null = null;

  public cuenta: any = {
    banco: '',
    color: '#FFFFFF'
  };
  public bancos = ['yape', 'plin', 'bcp', 'interbank', 'nacion', 'bbva'];
  public colores = ['#9061f9', '#72eade', '#ff5a1f', '#0e9f6e', '#ffb5b5', '#b5f2f2'];
  public colores_fondo = ['#FCFCFF', '#eafffc', '#FFFEFE', '#f3faf7', '#fff2f2', '#edffff'];
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
    this.initModal();
  }

  private initModal(): void {
    const modalElement = document.getElementById('crearCanchaModal');
    if (modalElement) {
      this.modal = new Modal(modalElement);
    }
  }

  openModal(): void {
    if (this.modal) {
      this.modal.show();
    }
  }

  closeModal(): void {
    if (this.modal) {
      this.modal.hide();
    }
  }

  init_data() {
    this.cuentas = [];
    this._userService.obtener_cuentas_grass(this.id, this.token).subscribe({
      next: (res) => {
        if (res.data.length == 0) {
          this.load_data = false;
          this.btn_crear = true;
        } else {
          this.cuentas = res.data;

          this.load_data = false;
          this.btn_crear = false;
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

  // Esta función se llama cuando cambia la selección del banco
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
          this._toastrService.showToast('Se registró con éxito');

          this.closeModal();
        },
        error: (err) => {
          this._toastrService.showToast('Error');
        }
      });
    }
  }

  eliminar(id: any) {
    this.load_btn = true;
    this._userService.eliminar_cuenta_grass(id, this.token).subscribe(
      response => {
        this._toastrService.showToast('Se eliminó con éxito');

        this.load_btn = false;
        this.init_data();
      }
    );
  }

}