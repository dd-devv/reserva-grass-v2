import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Datepicker, initFlowbite } from 'flowbite';
import type { DatepickerOptions } from 'flowbite';

@Component({
  selector: 'app-card-horario',
  templateUrl: './card-horario.component.html',
  styleUrls: ['./card-horario.component.css']
})
export class CardHorarioComponent implements OnInit {
  @Input() tipo!: string;
  @Input() botonesHoras!: any[];
  @Output() fechaSeleccionada = new EventEmitter<Date>();

  fechaMinima: string = '';
  fechaMaxima: string = '';
  datepicker: any;

  constructor() {
    const hoy = new Date();
    this.fechaMinima = this.formatearFecha(hoy);

    const unMesDespues = new Date();
    unMesDespues.setMonth(unMesDespues.getMonth() + 1);
    this.fechaMaxima = this.formatearFecha(unMesDespues);
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.inicializarDatepicker();
    }, 0);
    initFlowbite();
  }

  private inicializarDatepicker(): void {
    const targetEl = document.getElementById('datepicker-format');
    
    if (targetEl) {
      const options: DatepickerOptions = {
        minDate: this.fechaMinima,
        maxDate: this.fechaMaxima,
        autohide: true,
        format: 'mm/dd/yyyy',
      };

      this.datepicker = new Datepicker(targetEl, options);

      // Agregar el evento change al input
      targetEl.addEventListener('changeDate', (event: any) => {
        if (event.detail && event.detail.date) {
          this.fechaSeleccionada.emit(event.detail.date);
        }
      });
    }
  }

  private formatearFecha(fecha: Date): string {
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    const año = fecha.getFullYear();
    return `${mes}/${dia}/${año}`;
  }
}