import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  isMenuHidden = false;  // El menú comienza oculto

  // Alterna la visibilidad del menú
  toggleMenu() {
    this.isMenuHidden = !this.isMenuHidden;
  }

}
