// src/app/services/toast/toast.types.ts
export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export interface ToastConfig {
  message: string;
  duration?: number;
  type?: ToastType;
  className?: string;
  icon?: string;
  position?: ToastPosition;
  dismissible?: boolean;
}

export interface ToastStyles {
  container: string[];
  message: string[];
  icon: string[];
}

export interface ToastElements {
  container: HTMLElement;
  messageDiv: HTMLElement;
  icon: HTMLElement;
  closeButton?: HTMLElement;
}