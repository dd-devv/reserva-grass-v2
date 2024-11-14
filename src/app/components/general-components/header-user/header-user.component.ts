import { Component } from '@angular/core';

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrl: './header-user.component.css'
})
export class HeaderUserComponent {

  isMenuHidden = false;  // El menú comienza oculto

  // Alterna la visibilidad del menú
  toggleMenu() {
    this.isMenuHidden = !this.isMenuHidden;
  }

}
