import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../../../services/user.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css'
})
export class VerifyComponent implements OnInit {

  public codigo = '';
  public id: any;
  public email: any;

  constructor(
    private _title: Title,
    private _userService: UserService,
    private _toastrService: ToastService,
    private _router: Router
  ) {

    this.id = localStorage.getItem('_id');
    this.email = localStorage.getItem('user_email');
  }

  ngOnInit(): void {
    this._title.setTitle('Verificar correo');
  }

  verificar(verificarForm: any) {
    if (verificarForm.valid) {
      if (this.id) {
        this._userService.actualizar_user_verificado(this.id, this.codigo).subscribe({
          next: (res) => {
            this._toastrService.showToast('Se verificó correctamente');
            this._router.navigate(['/login']);
            localStorage.removeItem('user_email');
          },
          error: (err) => {
            this._toastrService.showToast('Código incorrecto, vuelve a intentarlo');
            this.codigo = '';
          }
        });
      } else {
        this._toastrService.showToast('Verifique su cuenta en el mismo dispositivo');
        this.codigo = '';
      }
    }
  }
}