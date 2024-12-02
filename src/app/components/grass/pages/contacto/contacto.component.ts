import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent implements OnInit {

  public contacto: any = {};
  public load_btn = false;

  constructor(
    private _title: Title,
    private _toastrService: ToastrService,
    private _userService: UserService
  ) {

  }

  ngOnInit(): void {
    this._title.setTitle('Contacto');
  }

  registro(registroForm: any) {
    if (registroForm.valid) {
      this.load_btn = true;
      this._userService.enviar_mensaje_contacto(this.contacto).subscribe(
        response => {
          this._toastrService.success('Se envió correctamente el mensaje', 'ENVIADO!');

          this.contacto = {};
          this.load_btn = false;
        }
      );
    } else {
      this._toastrService.error('No se envió, error!', 'ERROR!');
    }
  }

}