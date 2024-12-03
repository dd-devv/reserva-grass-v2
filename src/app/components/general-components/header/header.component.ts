import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  isMenuHidden = false;  // El menú comienza oculto
  screenWidth: number = window.screen.width;
  screenHeight: number = window.screen.height;

  toggleMenu() {
    this.isMenuHidden = !this.isMenuHidden;
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;

    if (this.screenHeight > this.screenWidth) {
      this.isMenuHidden = false;
    }
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