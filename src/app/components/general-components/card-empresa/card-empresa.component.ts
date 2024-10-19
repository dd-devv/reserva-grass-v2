import { Component,Input, OnInit } from '@angular/core';
import { caracteristicasCancha } from './core/core';
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'app-card-empresa',
  templateUrl: './card-empresa.component.html',
  styleUrl: './card-empresa.component.css'
})
export class CardEmpresaComponent implements OnInit {

  public url: string;
  
  @Input() caracteristicas!: caracteristicasCancha;

  constructor() { 
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    if(this.caracteristicas) {
      console.log(this.caracteristicas);
    }
  }
}
