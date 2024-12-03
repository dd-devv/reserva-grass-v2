import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { ToastService } from '../../../../services/toast/toast.service';

@Component({
  selector: 'app-resert-password',
  templateUrl: './resert-password.component.html',
  styleUrl: './resert-password.component.css'
})
export class ResertPasswordComponent implements OnInit {

  public token_pass: any;
  public token_exist = false;
  public pass: any;
  public passtext: any;
  public password = '';
  public password1 = '';
  public show = false;
  public alert_pass = false;
  public valid = false;
  public load_data = true;

  constructor(
    private _title: Title,
    private _route: ActivatedRoute,
    private _userService: UserService,
    private _toastrService: ToastService,
    private _router: Router
  ) {

    this._route.url.subscribe(url => {
      this.token_pass = url[1].path;

      this._userService.verificar_token_cambio_pass(this.token_pass).subscribe(
        response => {
          if (response.data) {
            this.token_exist = true;
            this.load_data = false;
          } else {
            this.token_exist = false;
            this.load_data = false;
          }
        }
      );
    });
  }

  ngOnInit(): void {
    this._title.setTitle('Cambiar contraseña');
    this.passtext = 'password';
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
    this._userService.cambiar_password_user(data, this.token_pass).subscribe(
      response => {
        if (response.data == undefined) {
          this._toastrService.error(response.message);

        } else if (response.data == true || response.data == 'true') {
          this._toastrService.success('Se cambió la contraseña');
          this._router.navigate(['/auth']);
        }
      }
    );

  }

}