import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { GuestService } from '../../../../services/guest.service';
import { UserService } from '../../../../services/user.service';
import { ToastService } from '../../../../services/toast/toast.service';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styleUrl: './datos.component.css'
})
export class DatosComponent implements OnInit {

  public empresa: any = {};

  public regiones: Array<any> = [];
  public namereg = '';
  public provincias: Array<any> = [];
  public nameprov = '';
  public distritos: Array<any> = [];

  public provincias_arr: Array<any> = [];
  public distritos_arr: Array<any> = [];
  public vacio = true;

  public valid = false;
  public load_btn = false;
  public load_data = false;

  public token;
  public id;
  public user_lc: any = {};
  public caracteristicas: any = {};
  public showUpdatePass = false;

  constructor(
    //private _userService: UserService,
    private _router: Router,
    private _title: Title,
    private _guestService: GuestService,
    private _userService: UserService,
    private _toastrService: ToastService
  ) {

    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');
    this.user_lc = JSON.parse(localStorage.getItem('user_data')!);

  }

  ngOnInit(): void {
    this._title.setTitle('GRASS | Actualizar datos');
    this._userService.obtener_empresa(this.id, this.token).subscribe({
      next: (res) => {
        this.empresa = res.data;
        this.load_data = false;

        this._userService.obtener_caracteristicas_empresa(this.id, this.token).subscribe({
          next: (resp) => {
            this.caracteristicas = resp.data[0];
            this.load_data = false;
          },
          error: (errr) => {
            this.caracteristicas = {
              techado: false,
              canchas_futsal: 0,
              canchas_voley: 0,
              iluminacion: false,
              garaje: false
            }
            this.load_data = false;
          }
        });
      },
      error: (err) => {
        this._toastrService.error('Usuario inexistente');
        this.load_data = false;
      }
    });
  }

  actualizar_caracteristicas() {
    this.load_btn = true;
    let data = {
      empresa: this.id,
      techado: this.caracteristicas.techado,
      canchas_futsal: this.caracteristicas.canchas_futsal,
      canchas_voley: this.caracteristicas.canchas_voley,
      iluminacion: this.caracteristicas.iluminacion,
      garaje : this.caracteristicas.garaje
    }

    this._userService.actualizar_caracteristicas_empresa(this.id, this.token, data).subscribe(
      response => {
        this._toastrService.success('Se actualizó con éxito');
        this.load_btn = false;
        this.ngOnInit();
      }
    );
  }

  actualizar() {
    let data = {
      nombre: this.empresa.nombre,
      direccion: this.empresa.direccion,
      telefono: this.empresa.telefono,
      ubicacion: this.empresa.ubicacion,
      referencia: this.empresa.referencia,
      hora_inicio: parseInt(this.empresa.hora_inicio),
      hora_fin: parseInt(this.empresa.hora_fin),
      telefono_fijo: this.empresa.telefono_fijo
    }

    this._userService.actualizar_empresa(this.id, data, this.token).subscribe({
      next: (res) => {
        this._toastrService.success('Se actualizó con éxito');
        this.load_btn = false;
        this._router.navigate(['/grass']);
      },
      error: (err) => {
        this._toastrService.error(err.message);
      }
    });
  }

  changeUpdatepass() {
    this.showUpdatePass = !this.showUpdatePass;
  }

}

