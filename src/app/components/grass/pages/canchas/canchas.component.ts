// canchas.component.ts
import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { UserService } from '../../../../services/user.service';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'app-canchas',
  templateUrl: './canchas.component.html',
  styleUrl: './canchas.component.css'
})
export class CanchasComponent implements OnInit {

  public galeria: Array<any> = [];
  public url;
  public token;
  public id;
  public load_data = true;
  public load_btn = false;
  public load_btn_crear = false;
  public btn_crear = false;
  public canchas: any = [];


  constructor(
    private _userService: UserService,
    private _title: Title,
    private _toastrService: ToastrService
  ) {

    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');
    this.url = environment.url;
  }

  ngOnInit(): void {
    this._userService.obtener_canchas_empresa(this.id, this.token).subscribe({
      next: (res) => {
        this.canchas = res.data;
        this.btn_crear = false;
        this.load_data = false;
      },
      error: (err) => {
        this.load_data = false;
        this.btn_crear = true;
      }
    }
    );
  }

  ngAfterViewInit(): void {
    // Initialize Flowbite
    initFlowbite();
  }

  eliminar(id: any) {
    this.load_btn = true;
    this._userService.eliminar_cancha_empresa(id, this.token).subscribe(
      response => {
        this._toastrService.success('Se eliminó con éxito');
        this.load_btn = false;
        this.ngOnInit();
      }
    );
  }
}