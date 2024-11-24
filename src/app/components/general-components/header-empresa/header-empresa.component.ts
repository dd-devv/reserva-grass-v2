import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header-empresa',
  templateUrl: './header-empresa.component.html',
  styleUrl: './header-empresa.component.css'
})
export class HeaderEmpresaComponent implements OnInit{

  constructor(
      private _authService: AuthService
    ) {
  
    }

  ngOnInit(): void {
    initFlowbite();
  }

  logout() {
    this._authService.logout();
    location.reload();
  }
}
