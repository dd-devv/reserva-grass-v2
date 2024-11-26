import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Dropdown, DropdownInterface, initFlowbite } from 'flowbite';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header-empresa',
  templateUrl: './header-empresa.component.html',
  styleUrl: './header-empresa.component.css'
})
export class HeaderEmpresaComponent implements OnInit, AfterViewInit{
  private dropdownInstance: DropdownInterface | null = null;
  constructor(
      private _authService: AuthService,
      private el: ElementRef, 
      private renderer: Renderer2
    ) {
  
    }

  ngOnInit(): void {
    initFlowbite();
  }

  ngAfterViewInit() {
    this.initializeDropdown();
  }


  private initializeDropdown() {
    const triggerElement = this.el.nativeElement.querySelector('#dropdownDefaultButton');
    const dropdownElement = this.el.nativeElement.querySelector('#dropdown');

    if (triggerElement && dropdownElement) {
      // Ensure dropdown is positioned relative to its trigger
      this.renderer.setStyle(dropdownElement, 'position', 'absolute');
      this.renderer.setStyle(triggerElement, 'position', 'relative');

      // Initialize Flowbite dropdown with custom placement
      this.dropdownInstance = new Dropdown(dropdownElement, triggerElement, {
        placement: 'bottom',
        triggerType: 'click',
        offsetSkidding: 0,
        offsetDistance: 10
      });
    }
  }

  // Optional: Method to manually close dropdown if needed
  closeDropdown() {
    if (this.dropdownInstance) {
      this.dropdownInstance.hide();
    }
  }


  logout() {
    this._authService.logout();
    location.reload();
  }
}
