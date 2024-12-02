import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgott-password',
  templateUrl: './forgott-password.component.html',
  styleUrl: './forgott-password.component.css'
})
export class ForgottPasswordComponent implements OnInit {

  public correo = '';

  constructor(
    private _title: Title,
    private _userService: UserService,
    private _toastrService: ToastrService,
    private _router: Router
  ) {

  }

  ngOnInit(): void {
    this._title.setTitle('Olvidó su contraseña');
  }

  verificar(verificarForm: any) {

    let data = {
      correo: this.correo
    }

    if (verificarForm.valid) {
      this._userService.registro_token_cambio_pass(data).subscribe(
        response => {
          if (response.data != undefined) {
            this._userService.enviar_correo_token_cambio_pass(this.correo).subscribe(
              response => {
                if (response.data) {
                  this._toastrService.success('Revise su correo, se envió un enlace de restauración', 'CORREO VERIFICADO!');
                  this._router.navigate(['/']);
                } else {
                  this._toastrService.error('No se pudo generar el código', 'ERROR');
                }
              }
            );
          } else {
            this._toastrService.error(response.message, 'ERROR');
          }
        }
      );
    }
  }

}
