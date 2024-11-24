import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../../../services/user.service';
import { GuestService } from '../../../../../../services/guest.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../../../../../services/toast/toast.service';
import { finalize } from 'rxjs';
import { Region, UpdateData } from '../../../../core/core';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styleUrl: './datos.component.css'
})
export class DatosComponent implements OnInit {

  public id;
  public token;
  public user: any = {};
  public regiones: Region[] = [];
  updateForm: FormGroup;
  isLoading = false;

  constructor(
    private _userService: UserService,
    private guestService: GuestService,
    private fb: FormBuilder,
    private toastr: ToastService
  ) {

    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');

    this.updateForm = this.fb.group({
      nombres: ['', Validators.required],
      email: [''],
      region: ['', Validators.required],
      whatsapp: ['']
    });
  }

  ngOnInit(): void {

    this.guestService.obtener_regiones().subscribe({
      next: (res) => {
        this.regiones = res.map((item: Region) => item.name);
      }
    });

    this._userService.obtener_user(this.id, this.token).subscribe({
      next: (res) => {
        this.user = res.data;
        
        // Asignar valores al formulario
        this.updateForm.patchValue({
          nombres: this.user.nombres,
          email: this.user.email,
          region: this.user.ciudad,
          whatsapp: this.user.telefono
        });
      },
      error: (err) => {
        this.user = {};
      }
    });
  }

  isValidField(field: string): boolean {
    const control = this.updateForm.get(field);
    return !!control && control.errors !== null && (control.dirty || control.touched);
  }

  getFieldError(field: string): string {
    const control = this.updateForm.get(field);
    if (!control || !control.errors) return '';

    const errors = control.errors;
    const errorMessages: { [key: string]: string } = {
      required: 'Este campo es requerido',
      minlength: `Mínimo ${errors['minlength']?.requiredLength} caracteres`
    };

    const firstError = Object.keys(errors)[0];
    return errorMessages[firstError] || 'Error de validación';
  }

  onSubmit(): void {
      if (this.updateForm.invalid || this.isLoading) {
        this.updateForm.markAllAsTouched();
        this.toastr.success('Por favor, complete todos los campos correctamente');
        return;
      }
  
      this.isLoading = true;
      const formData = this.updateForm.value;
  
      const updateData: UpdateData = {
        nombres: formData.nombres,
        ciudad: formData.region
      };
      
      this._userService
        .actualizar_user(this.id, updateData, this.token)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (response) => {
            this.toastr.success('Se actualizó con éxito');
          },
          error: (error) => {
            this.toastr.success(error.error.message || 'Error en la actualizacion');
          },
        });
    }
}
