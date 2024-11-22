import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../../services/user.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ToastService } from '../../../../../services/toast.service';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrl: './crear.component.css'
})
export class CrearComponent implements OnInit {
  public token: any;
  public id: any;
  public load_data = false;
  public load_btn = false;
  public load_btn_crear = false;
  public btn_crear = false;
  public btn_actualzar = false;
  public field_extra = false;
  public procede = false;
  public cancha: any = {
    tipo: '',
    hora_noche: ''
    //largo: 0,
    //ancho: 0,
    //precio_dia: 0,
    //precio_noche: 0,
  };
  public empresa: any = {};
  public data: any = {};

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _title: Title,
    private _toastrService: ToastService
  ) {
    this.token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');

    this.init_data();
  }

  ngOnInit(): void {
    this._title.setTitle('GRASS | Canchas');
  }

  init_data() {
    this._userService
      .obtener_empresa(this.id, this.token)
      .subscribe({
        next: (res) => {
          this.empresa = res.data;
          this.load_data = false;
        },
        error: (err) => {
          this._toastrService.showToast('Usuario inexistente');
          this.load_data = false;
        }
      });
  }

  select_tipo() {
    if (this.cancha.tipo == 'Mixto') {
      this.field_extra = true;
    } else {
      this.field_extra = false;
    }
  }

  registro(registroForm: any) {
    if (registroForm.valid) {
      this.load_btn_crear = true;

      if (this.field_extra) {
        this.data = {
          empresa: this.id,
          nombre: this.cancha.nombre,
          descripcion: this.cancha.descripcion,
          tipo: this.cancha.tipo,
          largo: this.cancha.largo,
          ancho: this.cancha.ancho,
          largo_voley: this.cancha.largo_voley,
          ancho_voley: this.cancha.ancho_voley,
          precio_dia: this.cancha.precio_dia,
          precio_reservacion: this.cancha.precio_reservacion,
          hora_noche: this.cancha.hora_noche,
          precio_noche: this.cancha.precio_noche,
          precio_dia_voley: this.cancha.precio_dia_voley,
          precio_noche_voley: this.cancha.precio_noche_voley,
        };
      } else {
        this.data = {
          empresa: this.id,
          nombre: this.cancha.nombre,
          descripcion: this.cancha.descripcion,
          tipo: this.cancha.tipo,
          largo: this.cancha.largo,
          ancho: this.cancha.ancho,
          precio_reservacion: this.cancha.precio_reservacion,
          hora_noche: this.cancha.hora_noche,
          precio_dia: this.cancha.precio_dia,
          precio_noche: this.cancha.precio_noche,
        };
      }

      this._userService
        .crear_cancha_empresa(this.id, this.token, this.data)
        .subscribe({
          next: (res) => {
            this._toastrService.showToast('Se creó con éxito');
            this.load_btn_crear = false;
            this._router.navigate(['/grass/canchas']);
          }
        });
    } else {
      this._toastrService.showToast(
        'Verifique y complete adecuadamente'
      );
      this.load_btn_crear = false;
    }
  }
}
