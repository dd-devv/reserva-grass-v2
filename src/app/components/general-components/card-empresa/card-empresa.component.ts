import { Component, Input, OnInit } from '@angular/core';
import { caracteristicasCancha } from './core/core';
import { GLOBAL } from '../../../services/global';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-empresa',
  templateUrl: './card-empresa.component.html',
  styleUrl: './card-empresa.component.css'
})
export class CardEmpresaComponent implements OnInit {

  public url: string;

  @Input() caracteristicas!: caracteristicasCancha;
  @Input() urlInput!: string;

  public isUser = false;

  constructor(
    private _authService: AuthService,
    private _router: Router
  ) {
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    if (this.caracteristicas) {
    }

    this.isUser = this._authService.isAuthenticatedUser();
  }

  redirect(path: string) {
    if (this.isUser) {
      this._router.navigate(['/usuario/ver', path]);
    } else {
      this._router.navigate(['/ver', path]);
    }
  }
}
