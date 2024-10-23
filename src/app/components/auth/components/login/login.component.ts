import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../../services/user.service';
import { finalize } from 'rxjs/operators';

interface LoginData {
  email: string;
  password: string;
}

interface User {
  _id: string;
  role: 'USER' | 'ADMIN' | 'GRASS';
  verificado: boolean;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isPasswordVisible = false;
  isLoading = false;
  rememberMe = true;

  private readonly token: string;
  private readonly userId: string;
  private readonly courtId: string | null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private titleService: Title,
    private toastr: ToastrService
  ) {
    this.token =
      localStorage.getItem('token') || sessionStorage.getItem('token') || '';
    this.userId =
      localStorage.getItem('_id') || sessionStorage.getItem('_id') || '';
    this.courtId = localStorage.getItem('id_cancha');

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Iniciar sesión');
    this.checkExistingSession();
  }

  private checkExistingSession(): void {
    if (this.token && this.userId) {
      this.redirectBasedOnRole();
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;
    const loginData: LoginData = this.loginForm.value;

    this.userService
      .login_user(loginData)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          if (!response.data) {
            this.handleCompanyLogin(loginData);
          } else {
            this.handleUserLogin(response);
          }
        },
        error: (error) => {
          this.toastr.error('Error al iniciar sesión', 'ERROR');
          console.error('Login error:', error);
        },
      });
  }

  private handleCompanyLogin(loginData: LoginData): void {
    this.userService
      .login_empresa(loginData)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          if (!response.data) {
            this.toastr.error(response.message, 'ERROR');
            return;
          }

          if (!response.data.verificado) {
            this.toastr.error('Empresa aún no verificada', 'ERROR!');
            this.router.navigate(['/wait']);
            return;
          }

          this.setAuthToken(response.token, response.data._id);
          this.redirectBasedOnRole(response.data);
        },
        error: (error) => {
          this.toastr.error('Error al iniciar sesión como empresa', 'ERROR');
          console.error('Company login error:', error);
        },
      });
  }

  private handleUserLogin(response: any): void {
    if (!response.data.verificado) {
      this.toastr.error('Correo aún no verificado', 'ERROR!');
      this.router.navigate(['/verificar']);
      return;
    }

    this.setAuthToken(response.token, response.data._id);
    this.redirectBasedOnRole(response.data);
  }

  private setAuthToken(token: string, userId: string): void {
    const storage = this.rememberMe ? localStorage : sessionStorage;
    storage.setItem('token', token);
    storage.setItem('_id', userId);
  }

  private redirectBasedOnRole(user?: User): void {
    const route = this.getRouteByRole(user?.role);
    this.router
      .navigate([route])
      .then(() => setTimeout(() => location.reload(), 500));
  }

  private getRouteByRole(role?: string): string {
    switch (role) {
      case 'USER':
        return this.courtId ? '/usuario/perfil/reservas' : '/usuario';
      case 'ADMIN':
        return '/admin';
      case 'GRASS':
        return '/grass';
      default:
        return '/usuario';
    }
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
