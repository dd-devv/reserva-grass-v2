import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, AfterViewInit {
  // Control de visibilidad de las secciones
  isInfoOpen = false;
  isSocialOpen = false;
  public isUser = false;
  
  // Función para alternar el estado de las secciones
  toggleSection(section: string) {
    if (section === 'info') {
      this.isInfoOpen = !this.isInfoOpen;
    } else if (section === 'social') {
      this.isSocialOpen = !this.isSocialOpen;
    }
  }
  
  // Referencia al div que se va a animar
  @ViewChild('animarDiv') animarDiv!: ElementRef;

  constructor(
    private _authService: AuthService
  ) {

  }
  
  ngOnInit(): void {
    this.isUser = this._authService.isAuthenticatedUser();
  }

  ngAfterViewInit() {
    this.iniciarObservador();
  }

  // Función para iniciar el observador de intersección
  iniciarObservador() {
    // Asegurarse de que el div existe
    if (!this.animarDiv) return;

    const divElement = this.animarDiv.nativeElement;

    // Crear un observador de intersección
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Cuando el div entra en el viewport, aplica la clase para animarlo
          divElement.classList.add('translate-x-0');
        } else {
          // Si el div ya no está visible, mueve el div fuera de la pantalla
          divElement.classList.remove('translate-x-0');
          divElement.classList.add('translate-x-[-100%]');
        }
      });
    }, { threshold: 0.5 }); // Se activa cuando el 50% del div es visible

    // Empieza a observar el div
    observer.observe(divElement);
  }
}
