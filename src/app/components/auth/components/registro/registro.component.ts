// registro.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../../../services/user.service';
import { GuestService } from '../../../../services/guest.service';
import { finalize } from 'rxjs/operators';
import { ToastService } from '../../../../services/toast/toast.service';
import { Region, RegisterData } from '../../core/core';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent implements OnInit {
  registerForm: FormGroup;
  regiones: Region[] = [];
  isLoading = false;
  selectedRegion: Region | null = null;
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
      nombres: ['', [Validators.required, Validators.minLength(3)]],
      // email: ['', [Validators.required, Validators.email, this.gmailValidator()]],
      region: ['', Validators.required],
      whatsapp: ['', [Validators.required, this.phoneValidator()]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Registro de usuario');

    this.guestService.obtener_regiones().subscribe({
      next: (res) => {
        this.regiones = res.map((item: Region) => item.name);
      }
    });
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  private gmailValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const isGmail = control.value.toLowerCase().endsWith('@gmail.com');
      return isGmail ? null : { invalidGmail: true };
    };
  }

  private phoneValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const phonePattern = /^9\d{8}$/;
      return phonePattern.test(control.value) ? null : { invalidPhone: true };
    };
  }

  private passwordMatchValidator(group: FormGroup): ValidationErrors | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  isValidField(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!control && control.errors !== null && (control.dirty || control.touched);
  }

  getFieldError(field: string): string {
    const control = this.registerForm.get(field);
    if (!control || !control.errors) return '';

    const errors = control.errors;
    const errorMessages: { [key: string]: string } = {
      required: 'Este campo es requerido',
      // email: 'Formato de correo inválido',
      // invalidGmail: 'Solo se permiten correos de Gmail',
      minlength: `Mínimo ${errors['minlength']?.requiredLength} caracteres`,
      invalidPhone: 'El teléfono debe empezar con 9 y tener 9 dígitos',
      passwordMismatch: 'Las contraseñas no coinciden'
    };

    const firstError = Object.keys(errors)[0];
    return errorMessages[firstError] || 'Error de validación';
  }

  private checkExistingSession(): void {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const userId = localStorage.getItem('_id') || sessionStorage.getItem('_id');

    if (token && userId) {
      this.router.navigate(['/usuario']);
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid || this.isLoading) {
      this.registerForm.markAllAsTouched();
      this.toastr.success('Por favor, complete todos los campos correctamente');
      return;
    }

    this.isLoading = true;
    const formData = this.registerForm.value;

    const registerData: RegisterData = {
      nombres: formData.nombres,
      // email: formData.email,
      ciudad: formData.region,
      telefono: formData.whatsapp,
      password: formData.password,
    };

    this.userService
      .registro_user(registerData)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          this.handleSuccessfulRegistration(response);
        },
        error: (error) => {
          console.log(error);

          this.toastr.success(error.error.message || 'Error en el registro');
        },
      });
  }

  private handleSuccessfulRegistration(response: any): void {
    localStorage.setItem('_id', response.data._id);
    localStorage.setItem('telefono', this.registerForm.get('whatsapp')?.value);
    sessionStorage.setItem('password', this.registerForm.get('password')?.value);
    this.toastr.success('Se registró con éxito');
    this.sendConfirmationEmail(response.data._id);
  }

  private sendConfirmationEmail(userId: string): void {
    this.userService.enviar_correo_confirmacion(userId).subscribe({
      next: (response) => {
        if (response.data) {
          this.toastr.success('Se envió el código de verificación');
          this.router.navigate(['/auth/verificar']);
        }
      },
      error: (error) => {
        this.toastr.success('Error al enviar el correo de confirmación');
        console.error('Error sending confirmation email:', error);
      },
    });
  }
}
