import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../../../services/toast.service';

@Component({
  selector: 'app-actualizar',
  templateUrl: './actualizar.component.html',
  styleUrl: './actualizar.component.css'
})
export class ActualizarComponent implements OnInit {

  public cancha: any = {};
  public token;
  public id: any;
  public load_btn = false;
  public load_btn_act = false;
  public load_data = true;
  public field_extra = false;

  constructor(
    private _title: Title,
    private _userService: UserService,
    private _toastrService: ToastService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {

    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  ngOnInit(): void {
    this._title.setTitle('GRASS | Editar cancha');

    this._route.params.subscribe(

      params => {
        this.id = params['id_cancha'];

        this._userService.obtener_cancha_empresa(this.id, this.token).subscribe(
          response => {
            if (response.data == undefined) {
              this.cancha = undefined;
              this.load_data = false;
            } else {
              this.cancha = response.data;
              if (this.cancha.tipo == 'Mixto') {
                this.field_extra = true;
              }
              this.load_data = false;
            }
          }
        );
      }
    );
  }

  actualizar() {
    this.load_btn_act = true;
    this._userService.actualizar_cancha_empresa(this.id, this.cancha, this.token).subscribe(
      response => {
        if (response.data == undefined) {
          this._toastrService.showToast(response.message);

        } else {
          this._toastrService.showToast('Se actualizó con éxito');
          this.load_btn_act = false;
          this._router.navigate(['/grass/canchas']);
        }
      }
    );
  }

}
