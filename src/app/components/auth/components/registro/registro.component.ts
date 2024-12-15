import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  AsyncValidatorFn
} from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../../../services/user.service';
import { GuestService } from '../../../../services/guest.service';
import { ToastService } from '../../../../services/toast/toast.service';
import { Region, RegisterData } from '../../core/core';

import { Observable, of } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent implements OnInit {
  registerForm: FormGroup;
  regiones: string[] = [];
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private guestService: GuestService,
    private router: Router,
    private titleService: Title,
    private toastr: ToastService
  ) {
    this.registerForm = this.fb.group({
      nombres: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z\s]+$/)  // Solo letras y espacios
      ]],
      region: ['', Validators.required],
      whatsapp: ['',
        {
          validators: [
            Validators.required,
            Validators.pattern(/^9\d{8}$/)  // Validación de patrón de teléfono
          ],
          asyncValidators: [this.whatsappValidator()],
          updateOn: 'blur'
        }
      ],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Registro de usuario');

    this.guestService.obtener_regiones().subscribe({
      next: (res) => {
        this.regiones = res.map((item: Region) => item.name);
      },
      error: (err) => {
        this.toastr.error('Error al cargar regiones');
        console.error(err);
      }
    });

    this.checkExistingSession();
  }

  // Validador de WhatsApp como función que devuelve un Observable
  private whatsappValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const phoneNumber = control.value;

      // Si no hay valor, no hay error
      if (!phoneNumber) {
        return of(null);
      }

      console.log(phoneNumber);

      // Verificación de WhatsApp
      return this.userService.verificar_whatsapp(phoneNumber).pipe(
        map(response => {
          console.log('WhatsApp Verification Response:', response);
          return response.data ? null : { noWhatsapp: true };
        }),
        catchError((error) => {
          console.error('WhatsApp Verification Error:', error);
          return of({ whatsappVerificationError: true });
        })
      );
    };
  }

  // Validador personalizado para coincidir contraseñas
  private passwordMatchValidator(group: FormGroup): ValidationErrors | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    return password && confirmPassword && password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  }

  // Método para alternar visibilidad de contraseña
  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  // Verificar si un campo tiene errores de validación
  isValidField(field: string): boolean {
    const control = this.registerForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  // Obtener mensaje de error para un campo
  getFieldError(field: string): string {
    const control = this.registerForm.get(field);
    if (!control || !control.errors) return '';

    const errors = control.errors;
    const errorMessages: { [key: string]: string } = {
      required: 'Este campo es requerido',
      minlength: `Mínimo ${errors['minlength']?.requiredLength} caracteres`,
      pattern: 'Formato inválido',
      invalidPhone: 'El teléfono debe tener 9 dígitos',
      noWhatsapp: 'El número no tiene WhatsApp',
      passwordMismatch: 'Las contraseñas no coinciden',
      whatsappVerificationError: 'Error al verificar WhatsApp'
    };

    const firstError = Object.keys(errors)[0];
    return errorMessages[firstError] || 'Error de validación';
  }

  // Verificar si existe una sesión activa
  private checkExistingSession(): void {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const userId = localStorage.getItem('_id') || sessionStorage.getItem('_id');

    if (token && userId) {
      this.router.navigate(['/usuario']);
    }
  }

  // Envío del formulario
  onSubmit(): void {
    // Marcar todos los campos como tocados para mostrar validaciones
    this.registerForm.markAllAsTouched();

    // Verificar validez del formulario
    if (this.registerForm.invalid || this.isLoading) {
      this.toastr.error('Por favor, complete todos los campos correctamente');
      return;
    }

    // Prevenir múltiples envíos
    if (this.registerForm.pending) {
      this.toastr.info('Verificando datos...');
      return;
    }

    this.isLoading = true;
    const formData = this.registerForm.value;

    const registerData: RegisterData = {
      nombres: formData.nombres,
      ciudad: formData.region,
      telefono: formData.whatsapp,
      password: formData.password,
    };

    this.userService.registro_user(registerData)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => this.handleSuccessfulRegistration(response),
        error: (error) => {
          console.error(error);
          this.toastr.error(error.error?.message || 'Error en el registro');
        }
      });
  }

  // Manejar registro exitoso
  private handleSuccessfulRegistration(response: any): void {
    localStorage.setItem('_id', response.data._id);
    localStorage.setItem('telefono', this.registerForm.get('whatsapp')?.value);
    sessionStorage.setItem('password', this.registerForm.get('password')?.value);

    this.toastr.success('Registro exitoso');
    this.sendConfirmationEmail(response.data._id);
  }

  // Enviar correo de confirmación
  private sendConfirmationEmail(userId: string): void {
    this.userService.enviar_correo_confirmacion(userId).subscribe({
      next: (response) => {
        if (response.data) {
          this.toastr.success('Código de verificación enviado');
          this.router.navigate(['/auth/verificar']);
        }
      },
      error: (error) => {
        this.toastr.error('Error al enviar el correo de confirmación');
        console.error('Error sending confirmation email:', error);
      }
    });
  }
}
