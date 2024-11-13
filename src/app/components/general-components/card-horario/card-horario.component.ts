import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Datepicker, initFlowbite } from 'flowbite';
import type { DatepickerOptions } from 'flowbite';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-card-horario',
  templateUrl: './card-horario.component.html',
  styleUrls: ['./card-horario.component.css']
})
export class CardHorarioComponent implements OnInit, AfterViewInit {






  @Input() tipo!: string;
  @Input() botonesHoras!: any[];
  @Input() cancha!: any;
  @Input() hora_fin!: number;
  @Output() fechaSeleccionada = new EventEmitter<Date>();

  fechaMinima: string = '';
  fechaMaxima: string = '';
  datepicker: any;

  public hora_inicio = 0;
  public cantidad_horas = 1;
  public precio_reservacion = 10;

  constructor(
    private _router: Router
  ,private toastService: ToastService) {
    const hoy = new Date();
    this.fechaMinima = this.formatearFecha(hoy);

    const unMesDespues = new Date();
    unMesDespues.setMonth(unMesDespues.getMonth() + 1);
    this.fechaMaxima = this.formatearFecha(unMesDespues);
  }

 

  ngOnInit(): void {
    this.precio_reservacion = this.cancha.precio_reservacion;
  }

  ngAfterViewInit(): void {
    // Esperamos a que el DOM esté listo y los datos cargados
    setTimeout(() => {
      this.inicializarDatepicker();
      this.inicializarFlowbite();
    }, 100);
  }

  private inicializarFlowbite(): void {
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
  mostrarToast() {
    this.toastService.showToast('No se pueden agregar más horas. Excede el horario de cierre.');
  }

  changeHoras(hora: number, cant: number) {
    const nuevaHoraFinal = hora + this.cantidad_horas + cant;
    if (nuevaHoraFinal <= this.hora_fin) {
      this.hora_inicio = hora;
      this.cantidad_horas += cant;
    } else {
      this.mostrarToast();
      console.log('No se pueden agregar más horas. Excede el horario de cierre.');
    }
  }

  onHoraSeleccionada(hora: any) {
    hora.estado === 'Libre' ? 'Reservado' : 'Libre';
    localStorage.setItem('fecha_reserva', hora.fecha.toDateString());
    localStorage.setItem('hora_inicio', hora.hora.toString());
    localStorage.setItem('hora_fin', (hora.hora + this.cantidad_horas).toString());
    localStorage.setItem('afuera', 'Y');
    this._router.navigate(['/auth']);
  }

  private formatearFecha(fecha: Date): string {
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    const año = fecha.getFullYear();
    return `${mes}/${dia}/${año}`;
  }

  // Si los datos cambian después de la carga inicial
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['botonesHoras'] && !changes['botonesHoras'].firstChange) {
      setTimeout(() => {
        this.inicializarFlowbite();
      }, 100);
    }
  }
}