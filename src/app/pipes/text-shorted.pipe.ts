import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textShorted'
})
export class TextShortedPipe implements PipeTransform {
  transform(texto: string): string {
    if (!texto || typeof texto !== 'string') {
      return '';
    }

    const palabras = texto.split(' ');

    if (palabras.length < 2) {
      return texto;
    }

    const primera_palabra = this.capitalizarPrimeraLetra(palabras[0]);

    const segunda_palabra = palabras[1][0].toUpperCase() + '.';

    return `${primera_palabra} ${segunda_palabra}`;
  }

  private capitalizarPrimeraLetra(palabra: string): string {
    if (!palabra) return '';
    return palabra.charAt(0).toUpperCase() + palabra.slice(1);
  }
}