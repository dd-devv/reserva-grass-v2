import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../../services/user.service';
import { Title } from '@angular/platform-browser';
import { ToastService } from '../../../../../services/toast/toast.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrl: './password.component.css'
})
export class PasswordComponent implements OnInit {

  public user: any;
  public token;
  public id;
  public pass: any;
  public passtext: any;
  public password = '';
  public password1 = '';
  public show = false;
  public alert_pass = false;
  public valid = false;
  public empresa: any = {};

  public verificado: boolean = false;

  constructor(
    private _router: Router,
    private _userService: UserService,
    private _title: Title,
    private _toastrService: ToastService
  ) {
    this.user = JSON.parse(localStorage.getItem('user_data')!);
    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');
  }

  ngOnInit(): void {
    this._title.setTitle('Perfil | Actualizar contraseña');
    this.passtext = 'password';

    this._userService.obtener_empresa(this.id, this.token).subscribe({
      next: (res) => {
        this.empresa = res.data;
      }
    });
  }

  comparar_password() {
    let data = {
      email: this.empresa.email,
      password: this.pass
    }

    this._userService.comparar_password(data, this.token).subscribe({
      next: (res) => {
        if (res.data) {
          this._toastrService.success('Se verificó con éxito');
  
          this.verificado = true;
          this.pass = '';
        } else {
          this._toastrService.warning('Contraseña incorrecta, intenta de nuevo!');
  
          this.verificado = false;
        }
        
      },
      error: (err) => {
        this._toastrService.error(err.message);
      }
    }
    );
  }

  onClickPass() {
    if (this.passtext === 'password') {
      this.passtext = 'text';
      this.show = true;
    } else {
      this.passtext = 'password';
      this.show = false;
    }
  }

  compare_password() {
    if (this.password1 == this.password) {
      this.alert_pass = false;
      this.valid = true;

    } else if (this.password1 != this.password) {
      this.alert_pass = true;
      this.valid = false;
    }
  }

  actualizar_password() {
    let data = {
      password: this.password
    }
    this._userService.actualizar_password_user(this.empresa._id, data, this.token).subscribe({
      next: (res) => {
        this._toastrService.success('Se actualizó la contraseña');

        this.verificado = false;
        this.password = '';
        this.password1 = '';
        this.pass = '';
        this.show = false;
        this.valid = false;
        this._router.navigate(['/grass']);

      },
      error: (err) => {
        this._toastrService.error(err.message);
      }
    }
    );
  }
}
