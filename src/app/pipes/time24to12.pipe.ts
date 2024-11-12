import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time24to12'
})
export class Time24to12Pipe implements PipeTransform {
  transform(hour: number): string {
    if (hour < 0 || hour > 23) return '';

    // Configurar el periodo (AM/PM)
    const period = hour >= 12 ? 'Pm' : 'Am';

    // Convertir a formato 12 horas
    let hour12 = hour % 12;
    hour12 = hour12 === 0 ? 12 : hour12;

    // Formatear la hora con ceros a la izquierda si es necesario
    const formattedHour = hour12 < 10 ? `0${hour12}` : `${hour12}`;

    return `${formattedHour} ${period}`;
  }
}
