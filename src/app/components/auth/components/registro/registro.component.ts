import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../../services/user.service';
import { GuestService } from '../../../../services/guest.service';
import { finalize } from 'rxjs/operators';

interface Region {
  id: string;
  name: string;
}

interface RegisterData {
  nombres: string;
  email: string;
  ciudad: string;
  telefono: string;
  password: string;
}

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent implements OnInit {
  // Inicializamos el formulario directamente
  registerForm: FormGroup;
  regiones: Region[] = [];
  isPasswordVisible = false;
  isLoading = false;
  selectedRegion: Region | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private guestService: GuestService,
    private router: Router,
    private titleService: Title,
    private toastr: ToastrService
  ) {
    this.loadRegions();
    this.checkExistingSession();

    this.registerForm = this.fb.group(
      {
        nombres: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        region: ['', Validators.required],
        telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  ngOnInit(): void {
    this.titleService.setTitle('Registro de usuario');
    this.setupPasswordValidation();
  }

  private passwordMatchValidator(g: FormGroup): null | object {
    const password = g.get('password');
    const confirmPassword = g.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    }

    confirmPassword.setErrors(null);
    return null;
  }

  private loadRegions(): void {
    this.guestService.obtener_regiones().subscribe({
      next: (response: any[]) => {
        this.regiones = response.map((element) => ({
          id: element.id,
          name: element.name,
        }));
      },
      error: (error) => {
        this.toastr.error('Error al cargar las regiones', 'ERROR');
        console.error('Error loading regions:', error);
      },
    });
  }

  private checkExistingSession(): void {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    const userId = localStorage.getItem('_id') || sessionStorage.getItem('_id');

    if (token && userId) {
      this.router.navigate(['/usuario']);
    }
  }

  private setupPasswordValidation(): void {
    const confirmPasswordControl = this.registerForm.get('confirmPassword');
    const passwordControl = this.registerForm.get('password');

    if (confirmPasswordControl && passwordControl) {
      confirmPasswordControl.valueChanges.subscribe(() => {
        this.registerForm.updateValueAndValidity();
      });
    }
  }

  onRegionChange(): void {
    const regionId = this.registerForm.get('region')?.value;
    this.selectedRegion =
      this.regiones.find((region) => region.id === regionId) || null;
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit(): void {
    if (this.registerForm.invalid || this.isLoading) {
      this.toastr.error(
        'Por favor, complete todos los campos correctamente',
        'ERROR'
      );
      return;
    }

    this.isLoading = true;
    const formData = this.registerForm.value;

    const registerData: RegisterData = {
      nombres: formData.nombres,
      email: formData.email,
      ciudad: this.selectedRegion?.name || '',
      telefono: formData.telefono,
      password: formData.password,
    };

    this.userService
      .registro_user(registerData)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.handleSuccessfulRegistration(response);
        },
        error: (error) => {
          this.toastr.error(
            error.error.message || 'Error en el registro',
            'ERROR'
          );
        },
      });
  }

  private handleSuccessfulRegistration(response: any): void {
    localStorage.setItem('_id', response.data._id);
    localStorage.setItem('user_email', this.registerForm.get('email')?.value);

    this.toastr.success('Se registró con éxito', 'REGISTRADO!');

    this.sendConfirmationEmail(response.data._id);
  }

  private sendConfirmationEmail(userId: string): void {
    this.userService.enviar_correo_confirmacion(userId).subscribe({
      next: (response) => {
        if (response.data) {
          this.toastr.success('Se envió el código de verificación', 'ENVIADO!');
          this.router.navigate(['/verificar']);
        }
      },
      error: (error) => {
        this.toastr.error('Error al enviar el correo de confirmación', 'ERROR');
        console.error('Error sending confirmation email:', error);
      },
    });
  }
}
