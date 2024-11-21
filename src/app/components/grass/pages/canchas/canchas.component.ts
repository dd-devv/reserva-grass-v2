// canchas.component.ts
import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { UserService } from '../../../../services/user.service';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { GLOBAL } from '../../../../services/global';


@Component({
  selector: 'app-canchas',
  templateUrl: './canchas.component.html',
  styleUrl: './canchas.component.css'
})
export class CanchasComponent implements OnInit, AfterViewInit, OnDestroy {

  public galeria: Array<any> = [];
  public url;
  public token;
  public id;
  public load_data = false;
  public load_btn = false;
  public load_btn_crear = false;
  public btn_crear = false;
  public canchas : any = [];


  @ViewChild('carouselExample') carouselElement!: ElementRef;

  private carousel: any;

  
  constructor(
    private _userService: UserService,
    private _title: Title,
    private _toastrService: ToastrService
  ){

    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');
    this.url = GLOBAL.url;
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

  ngOnDestroy(): void {
    if (this.carousel) {
      this.carousel.pause();
    }
  }
}