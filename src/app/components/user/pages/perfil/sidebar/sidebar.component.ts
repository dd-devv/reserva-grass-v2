import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../../services/auth.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

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