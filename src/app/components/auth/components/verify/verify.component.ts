// import { Component, OnInit } from '@angular/core';
// import { Title } from '@angular/platform-browser';
// import { UserService } from '../../../../services/user.service';
// import { Router } from '@angular/router';
// import { ToastService } from '../../../../services/toast.service';

// @Component({
//   selector: 'app-verify',
//   templateUrl: './verify.component.html',
//   styleUrl: './verify.component.css'
// })
// export class VerifyComponent implements OnInit {

//   public codigo = '';
//   public id: any;
//   public email: any;

//   constructor(
//     private _title: Title,
//     private _userService: UserService,
//     private _toastrService: ToastService,
//     private _router: Router
//   ) {

//     this.id = localStorage.getItem('_id');
//     this.email = localStorage.getItem('user_email');
//   }

//   ngOnInit(): void {
//     this._title.setTitle('Verificar correo');
//   }

//   verificar(verificarForm: any) {
//     if (verificarForm.valid) {
//       if (this.id) {
//         this._userService.actualizar_user_verificado(this.id, this.codigo).subscribe({
//           next: (res) => {
//             this._toastrService.showToast('Se verificó correctamente');
//             this._router.navigate(['/login']);
//             localStorage.removeItem('user_email');
//           },
//           error: (err) => {
//             this._toastrService.showToast('Código incorrecto, vuelve a intentarlo');
//             this.codigo = '';
//           }
//         });
//       } else {
//         this._toastrService.showToast('Verifique su cuenta en el mismo dispositivo');
//         this.codigo = '';
//       }
//     }
//   }
// }










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
  public codigo1 = '';
  public codigo2 = '';
  public codigo3 = '';
  public codigo4 = '';
  public codigo5 = '';
  public codigo6 = '';
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

  onInput(event: any, position: number, nextInput?: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Asegurar que solo haya un dígito
    if (value.length > 1) {
      value = value.slice(-1);
      input.value = value;
    }

    // Actualizar el valor correspondiente usando un switch
    switch(position) {
      case 0:
        this.codigo1 = value;
        break;
      case 1:
        this.codigo2 = value;
        break;
      case 2:
        this.codigo3 = value;
        break;
      case 3:
        this.codigo4 = value;
        break;
      case 4:
        this.codigo5 = value;
        break;
      case 5:
        this.codigo6 = value;
        break;
    }

    // Si hay un valor y hay siguiente input, pasar al siguiente
    if (value && nextInput) {
      nextInput.focus();
    }

    // Actualizar el código completo
    this.actualizarCodigo();
  }

  onBackspace(event: any, prevInput: any, position: number) {
    const input = event.target as HTMLInputElement;
    
    // Si el input está vacío y hay input anterior, regresar
    if (!input.value && prevInput) {
      prevInput.focus();
      // Actualizar el valor correspondiente usando un switch
      switch(position) {
        case 1:
          this.codigo1 = '';
          break;
        case 2:
          this.codigo2 = '';
          break;
        case 3:
          this.codigo3 = '';
          break;
        case 4:
          this.codigo4 = '';
          break;
        case 5:
          this.codigo5 = '';
          break;
        case 6:
          this.codigo6 = '';
          break;
      }
      this.actualizarCodigo();
    }
  }

  actualizarCodigo() {
    this.codigo = this.codigo1 + this.codigo2 + this.codigo3 + 
                  this.codigo4 + this.codigo5 + this.codigo6;
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
            // Limpiar todos los inputs
            this.codigo1 = '';
            this.codigo2 = '';
            this.codigo3 = '';
            this.codigo4 = '';
            this.codigo5 = '';
            this.codigo6 = '';
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
