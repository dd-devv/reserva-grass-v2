import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-horario',
  templateUrl: './card-horario.component.html',
  styleUrl: './card-horario.component.css'
})
export class CardHorarioComponent {

  @Input() tipo!: string;
  @Input() botonesHoras!: any [];

}
