import { Component, Input, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-card-horario',
  templateUrl: './card-horario.component.html',
  styleUrl: './card-horario.component.css'
})
export class CardHorarioComponent implements OnInit {

  @Input() tipo!: string;

  ngOnInit(): void {
    initFlowbite();
  }
}
