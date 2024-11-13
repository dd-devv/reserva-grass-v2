import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-card-sport-features',
  templateUrl: './card-sport-features.component.html',
  styleUrl: './card-sport-features.component.css'
})
export class CardSportFeaturesComponent implements OnInit {
  @Input() cancha: any;
  @Output() tipo_cancha = new EventEmitter<string>();
  @Output() id_cancha = new EventEmitter<string>();

  public tipo = '';

  constructor() {

  }

  ngOnInit(): void {

  }

  onSelect(tipo: string, id: string): void {
    this.tipo = tipo;
    this.tipo_cancha.emit(this.tipo);
    this.id_cancha.emit(id);
  }
}
