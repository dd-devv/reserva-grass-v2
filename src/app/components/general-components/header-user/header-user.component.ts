import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrl: './header-user.component.css'
})
export class HeaderUserComponent implements OnInit {



  constructor(
    private _authService: AuthService
  ) {

  }


  isMenuHidden = false;  // El menú comienza oculto
  screenWidth: number = window.screen.width;
  screenHeight: number = window.screen.height;

  toggleMenu() {
    this.isMenuHidden = !this.isMenuHidden;
  }

  ngOnInit(): void {
    initFlowbite();
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;

    if (this.screenHeight > this.screenWidth) {
      this.isMenuHidden = true;
    }
  }
  logout() {
    this._authService.logout();
    location.reload();
  }
  @HostListener('window:resize')
  onResize() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;

    if (this.screenHeight > this.screenWidth) {
      this.isMenuHidden = true;
    }
  }

}
