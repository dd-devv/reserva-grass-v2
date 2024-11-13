import { Injectable, Renderer2, RendererFactory2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private renderer: Renderer2;
  private currentToast: HTMLElement | null = null;

  constructor(rendererFactory: RendererFactory2, @Inject(DOCUMENT) private document: Document) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  showToast(message: string, duration: number = 3000) {
    // Verificar si ya hay un toast activo y eliminarlo
    if (this.currentToast) {
      this.renderer.removeChild(this.document.body, this.currentToast);
      this.currentToast = null;
    }

    // Crear el contenedor del toast
    const toastContainer = this.renderer.createElement('div');
    this.renderer.addClass(toastContainer, 'fixed');
    this.renderer.addClass(toastContainer, 'top-5');
    this.renderer.addClass(toastContainer, 'right-5');
    this.renderer.addClass(toastContainer, 'p-4');
    this.renderer.addClass(toastContainer, 'bg-white');
    this.renderer.addClass(toastContainer, 'rounded-lg');
    this.renderer.addClass(toastContainer, 'shadow-md');
    this.renderer.addClass(toastContainer, 'flex');
    this.renderer.addClass(toastContainer, 'items-center');
    this.renderer.addClass(toastContainer, 'space-x-4');
    this.renderer.addClass(toastContainer, 'border');
    this.renderer.addClass(toastContainer, 'border-gray-200');
    this.renderer.addClass(toastContainer, 'transition-opacity');
    this.renderer.addClass(toastContainer, 'z-50');
    this.renderer.addClass(toastContainer, 'bg-red-800');
    this.renderer.addClass(toastContainer, 'max-w-sm');
    this.renderer.addClass(toastContainer, 'animate-bounce');
    this.renderer.addClass(toastContainer, 'duration-700');

    // Crear el mensaje
    const textNode = this.renderer.createText(message);
    const messageDiv = this.renderer.createElement('div');
    this.renderer.addClass(messageDiv, 'text-sm');
    this.renderer.addClass(messageDiv, 'font-medium');
    this.renderer.addClass(messageDiv, 'text-red-900');
    this.renderer.addClass(messageDiv, 'text-pretty');
    this.renderer.appendChild(messageDiv, textNode);

    // Añadir el mensaje al contenedor
    this.renderer.appendChild(toastContainer, messageDiv);

    // Crear el ícono utilizando un carácter Unicode
    const icon = this.renderer.createElement('span');
    const iconText = this.renderer.createText('❗'); // Puedes reemplazarlo por cualquier otro carácter
    this.renderer.addClass(icon, 'ml-2');
    this.renderer.setStyle(icon, 'font-size', '1.5rem');
    this.renderer.setStyle(icon, 'color', '#b91c1c'); // Color para que combine con el texto

    // Añadir el icono al contenedor
    this.renderer.appendChild(icon, iconText);
    this.renderer.appendChild(toastContainer, icon);

    // Añadir el contenedor al DOM
    this.renderer.appendChild(this.document.body, toastContainer);

    // Guardar el toast actual
    this.currentToast = toastContainer;

    // Configurar la eliminación del toast después de la duración
    setTimeout(() => {
      if (this.currentToast === toastContainer) {
        this.renderer.removeChild(this.document.body, toastContainer);
        this.currentToast = null;
      }
    }, duration);
  }
}
