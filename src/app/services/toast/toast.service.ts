import { Injectable, Renderer2, RendererFactory2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ToastConfig, ToastType, ToastStyles, ToastElements, ToastPosition } from './toast.types';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private renderer: Renderer2;
  private activeToasts: Map<string, HTMLElement> = new Map();
  private toastCount$ = new BehaviorSubject<number>(0);

  private readonly defaultDuration: number = 3000;
  private readonly maxToasts: number = 3;

  private readonly positionStyles: Record<ToastPosition, string[]> = {
    'top-right': ['top-5', 'right-5'],
    'top-left': ['top-5', 'left-5'],
    'bottom-right': ['bottom-5', 'right-5'],
    'bottom-left': ['bottom-5', 'left-5'],
    'top-center': ['top-5', 'left-1/2', '-translate-x-1/2'],
    'bottom-center': ['bottom-5', 'left-1/2', '-translate-x-1/2']
  };

  private readonly toastStyles: Record<ToastType, ToastStyles> = {
    success: {
      container: [
        'fixed', 'p-4', 'bg-green-50', 'rounded-lg', 'shadow-md', 
        'flex', 'items-center', 'space-x-4', 'border', 'border-green-200', 
        'transition-all', 'z-50', 'max-w-sm', 'animate-fade-in'
      ],
      message: ['text-sm', 'font-medium', 'text-green-800'],
      icon: ['text-green-600']
    },
    error: {
      container: [
        'fixed', 'p-4', 'bg-red-50', 'rounded-lg', 'shadow-md', 
        'flex', 'items-center', 'space-x-4', 'border', 'border-red-200', 
        'transition-all', 'z-50', 'max-w-sm', 'animate-fade-in'
      ],
      message: ['text-sm', 'font-medium', 'text-red-800'],
      icon: ['text-red-600']
    },
    warning: {
      container: [
        'fixed', 'p-4', 'bg-yellow-50', 'rounded-lg', 'shadow-md', 
        'flex', 'items-center', 'space-x-4', 'border', 'border-yellow-200', 
        'transition-all', 'z-50', 'max-w-sm', 'animate-fade-in'
      ],
      message: ['text-sm', 'font-medium', 'text-yellow-800'],
      icon: ['text-yellow-600']
    },
    info: {
      container: [
        'fixed', 'p-4', 'bg-blue-50', 'rounded-lg', 'shadow-md', 
        'flex', 'items-center', 'space-x-4', 'border', 'border-blue-200', 
        'transition-all', 'z-50', 'max-w-sm', 'animate-fade-in'
      ],
      message: ['text-sm', 'font-medium', 'text-blue-800'],
      icon: ['text-blue-600']
    }
  };

  private readonly toastIcons: Record<ToastType, string> = {
    success: '✓',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  success(message: string, config: Partial<Omit<ToastConfig, 'message' | 'type'>> = {}): void {
    this.show({ ...config, message, type: 'success' });
  }

  error(message: string, config: Partial<Omit<ToastConfig, 'message' | 'type'>> = {}): void {
    this.show({ ...config, message, type: 'error' });
  }

  warning(message: string, config: Partial<Omit<ToastConfig, 'message' | 'type'>> = {}): void {
    this.show({ ...config, message, type: 'warning' });
  }

  info(message: string, config: Partial<Omit<ToastConfig, 'message' | 'type'>> = {}): void {
    this.show({ ...config, message, type: 'info' });
  }

  getToastCount(): Observable<number> {
    return this.toastCount$.asObservable();
  }

  show(config: ToastConfig): void {
    const {
      message,
      duration = this.defaultDuration,
      type = 'info',
      className,
      icon,
      position = 'top-right',
      dismissible = true
    } = config;

    /* this.manageToastLimit(); */

    const toastId = this.generateUniqueId();
    const toastElements = this.createToastElements(message, type, icon ?? this.toastIcons[type], dismissible);
    
    this.applyStyles(toastElements, type, position, className);
    this.appendToastToDOM(toastElements, toastId);
    
    if (duration > 0) {
      this.setupAutoDismiss(toastId, duration);
    }
  }

  dismiss(toastId: string): void {
    const toast = this.activeToasts.get(toastId);
    if (toast) {
      this.removeToast(toastId);
    }
  }

  clearAll(): void {
    this.activeToasts.forEach((_, id) => this.dismiss(id));
  }

  private createToastElements(
    message: string, 
    type: ToastType, 
    iconContent: string,
    dismissible: boolean
  ): ToastElements {
    const container = this.renderer.createElement('div');
    const messageDiv = this.renderer.createElement('div');
    const icon = this.renderer.createElement('span');
    
    this.renderer.appendChild(messageDiv, this.renderer.createText(message));
    this.renderer.appendChild(icon, this.renderer.createText(iconContent));

    // Crear un contenedor para el icono y el mensaje
    const contentContainer = this.renderer.createElement('div');
    this.renderer.addClass(contentContainer, 'flex');
    this.renderer.addClass(contentContainer, 'items-center');
    this.renderer.addClass(contentContainer, 'space-x-2');
    this.renderer.addClass(contentContainer, 'flex-grow');

    this.renderer.appendChild(contentContainer, icon);
    this.renderer.appendChild(contentContainer, messageDiv);
    this.renderer.appendChild(container, contentContainer);

    const elements: ToastElements = { container, messageDiv, icon };

    if (dismissible) {
      const closeButton = this.createCloseButton();
      elements.closeButton = closeButton;
      this.renderer.appendChild(container, closeButton);
    }

    return elements;
  }

  private createCloseButton(): HTMLElement {
    const closeButton = this.renderer.createElement('button');
    this.renderer.appendChild(closeButton, this.renderer.createText('×'));
    
    this.renderer.addClass(closeButton, 'ml-auto');
    this.renderer.addClass(closeButton, 'text-gray-400');
    this.renderer.addClass(closeButton, 'hover:text-gray-900');
    this.renderer.addClass(closeButton, 'text-lg');
    this.renderer.addClass(closeButton, 'font-semibold');
    
    return closeButton;
  }

  private applyStyles(
    elements: ToastElements,
    type: ToastType,
    position: ToastPosition,
    additionalClasses?: string
  ): void {
    const styles = this.toastStyles[type];
    const positionClasses = this.positionStyles[position];

    [...styles.container, ...positionClasses].forEach((className: string) => {
      this.renderer.addClass(elements.container, className);
    });

    // Solo procesar additionalClasses si está definido y no está vacío
    if (additionalClasses?.trim()) {
      additionalClasses.split(' ').filter(Boolean).forEach((className: string) => {
        if (className.trim()) {
          this.renderer.addClass(elements.container, className.trim());
        }
      });
    }

    styles.message.forEach((className: string) => {
      this.renderer.addClass(elements.messageDiv, className);
    });

    styles.icon.forEach((className: string) => {
      this.renderer.addClass(elements.icon, className);
    });
    
    this.renderer.setStyle(elements.icon, 'font-size', '1.25rem');
  }

  private appendToastToDOM(elements: ToastElements, toastId: string): void {
    this.renderer.appendChild(this.document.body, elements.container);
    this.activeToasts.set(toastId, elements.container);
    this.toastCount$.next(this.activeToasts.size);
  }

  private setupAutoDismiss(toastId: string, duration: number): void {
    setTimeout(() => this.dismiss(toastId), duration);
  }

  private removeToast(toastId: string): void {
    const toast = this.activeToasts.get(toastId);
    if (toast) {
      this.renderer.addClass(toast, 'animate-fade-out');
      
      setTimeout(() => {
        this.renderer.removeChild(this.document.body, toast);
        this.activeToasts.delete(toastId);
        this.toastCount$.next(this.activeToasts.size);
      }, 150);
    }
  }

 /*  private manageToastLimit(): void {
    if (this.activeToasts.size >= this.maxToasts) {
      const oldestToastId = this.activeToasts.keys().next().value;
      this.dismiss(oldestToastId);
    }
  } */

  private generateUniqueId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}