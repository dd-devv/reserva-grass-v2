import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { GuestService } from '../../../../services/guest.service';
import { UserService } from '../../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { initFlowbite } from 'flowbite';

interface Region {
  id: string;
  name: string;
}

interface RegionResponse {
  id: string;
  name: string;
}

interface Provincia {
  id: string;
  name: string;
  department_id: string;
}

interface Distrito {
  id: string;
  name: string;
  province_id: string;
}

interface Company {
  nombre: string;
  direccion: string;
  email: string;
  telefono: string;
  telefono_fijo: string;
  region: string;
  provincia: string;
  distrito: string;
  ubicacion: string;
  referencia: string;
  horario_atencion: string;
  password: string;
}

interface CompanyCharacteristics {
  empresa: string;
  techado: boolean;
  canchas_futsal: number;
  canchas_voley: number;
  iluminacion: boolean;
  garaje: boolean;
}

@Component({
  selector: 'app-registro-empresa',
  templateUrl: './registro-empresa.component.html',
  styleUrls: ['./registro-empresa.component.css']
})
export class RegistroEmpresaComponent implements OnInit {


 
  // Forms - initialize with definite assignment assertion
  registrationForm: FormGroup;
  characteristicsForm: FormGroup;

  // Location data
  regiones: Region[] = [];
  provincias: any[] = [];
  distritos: any[] = [];
  namereg = '';
  nameprov = '';

  // UI states
  passwordVisible = false;
  isLoading = false;
  isDisabledProvincia = true;
  isDisabledDistrito = true;

  // Map configuration
  readonly mapConfig = {
    center: { lat: -13.1588, lng: -74.2232 },
    zoom: 13,
    styles: [
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#e9e9e9" }, { "lightness": 17 }]
      },
      {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [{ "color": "#f5f5f5" }, { "lightness": 20 }]
      }
    ]
  };

  map?: google.maps.Map;
  selectedLocation: google.maps.LatLngLiteral | null = null;

  public step = 1;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private title: Title,
    private guestService: GuestService,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    this.loadRegions();

    this.characteristicsForm = this.fb.group({
      techado: [false],
      canchas_futsal: [0, [Validators.min(0)]],
      canchas_voley: [0, [Validators.min(0)]],
      iluminacion: [false],
      garaje: [false]
    });

    this.registrationForm = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      email: ['', [Validators.required, this.gmailValidator()]],
      telefono: ['', [Validators.required, this.phoneValidator()]],
      telefono_fijo: ['', [this.telefonoFijoValidator]], // Opcional con validación
      region: ['', Validators.required],
      provincia: ['', Validators.required],
      distrito: ['', Validators.required],
      ubicacion: ['', Validators.required],
      referencia: ['', Validators.required],
      horario_inicio: ['', [Validators.required, this.horaValidator]],
      horario_fin: ['', [Validators.required, this.horaValidator]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: [this.passwordMatchValidator, this.horasRangeValidator] });

  }

  ngOnInit(): void {
    this.title.setTitle('Registro de empresas');
    initFlowbite();
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

  // Validador personalizado para teléfono fijo
  private telefonoFijoValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null; // Permite valor vacío
    const valid = /^\d+$/.test(control.value);
    return valid ? null : { invalidLandline: true };
  }

  // Validador personalizado para horas
  private horaValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const hora = parseInt(control.value);
    const valid = !isNaN(hora) && hora >= 0 && hora <= 23;
    return valid ? null : { invalidTime: true };
  }

  // Validador de rango de horas
  private horasRangeValidator(group: AbstractControl): ValidationErrors | null {
    if (group instanceof FormGroup) {
      const inicio = group.get('horario_inicio')?.value;
      const fin = group.get('horario_fin')?.value;

      if (inicio && fin) {
        const inicioHora = parseInt(inicio);
        const finHora = parseInt(fin);

        if (inicioHora >= finHora) {
          return { invalidTimeRange: true };
        }
      }
    }
    return null;
  }

  getFieldError(field: string): string {
    const control = this.registrationForm.get(field);
    if (!control || !control.errors) return '';

    const errors = control.errors;
    const errorMessages: { [key: string]: string } = {
      required: 'Este campo es requerido',
      email: 'Formato de correo inválido',
      invalidGmail: 'Solo se permiten correos de Gmail',
      minlength: `Mínimo ${errors['minlength']?.requiredLength} caracteres`,
      invalidPhone: 'El teléfono debe empezar con 9 y tener 9 dígitos',
      invalidLandline: 'Solo se permiten números en el teléfono fijo',
      invalidTime: 'Debe ser una hora entre 00 y 23',
      invalidTimeRange: 'La hora de inicio debe ser menor a la hora de fin',
      passwordMismatch: 'Las contraseñas no coinciden'
    };

    const firstError = Object.keys(errors)[0];
    return errorMessages[firstError] || 'Error de validación';
  }

  isValidField(field: string): boolean {
    const control = this.registrationForm.get(field);
    return control ? control.errors !== null && control.touched : false;
  }

  private async loadRegions(): Promise<void> {
    try {
      const response = await this.guestService.obtener_regiones().toPromise() as RegionResponse[];
      this.regiones = response.map((region: RegionResponse) => ({
        id: region.id,
        name: region.name
      }));
    } catch (error) {
      this.toastr.error('Error al cargar regiones');
    }
  }

  async onRegionChange(): Promise<void> {
    const regionId = this.registrationForm.get('region')?.value;
    if (!regionId) return;

    this.isDisabledProvincia = false;
    this.isDisabledDistrito = true;
    this.registrationForm.patchValue({ provincia: '', distrito: '' });

    try {
      const response = await this.guestService.obtener_provincias().toPromise();
      this.provincias = response.filter((p: { department_id: any; }) => p.department_id === regionId);

      const region = this.regiones.find(r => r.id === regionId);
      this.namereg = region?.name || '';
    } catch (error) {
      this.toastr.error('Error al cargar provincias');
    }
  }

  async onProvinciaChange(): Promise<void> {
    const provinciaId = this.registrationForm.get('provincia')?.value;
    if (!provinciaId) return;

    this.isDisabledDistrito = false;
    this.registrationForm.patchValue({ distrito: '' });

    try {
      const response = await this.guestService.obtener_distritos().toPromise();
      this.distritos = response.filter((d: { province_id: any; }) => d.province_id === provinciaId);

      const provincia = this.provincias.find(p => p.id === provinciaId);
      this.nameprov = provincia?.name || '';
    } catch (error) {
      this.toastr.error('Error al cargar distritos');
    }
  }

  onMapClick(event: google.maps.MapMouseEvent): void {
    if (!event.latLng) return;

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    this.selectedLocation = { lat, lng };
    this.registrationForm.patchValue({
      ubicacion: `https://www.google.com/maps?q=${lat},${lng}`
    });
  }

  nextStep(value: number) {
    this.step = value;
  }

  async onSubmit(): Promise<void> {
    if (this.registrationForm.invalid) {
      this.toastr.error('Por favor complete todos los campos requeridos');
      return;
    }

    this.isLoading = true;

    try {
      const companyData: Company = {
        ...this.registrationForm.value,
        region: this.namereg,
        provincia: this.nameprov
      };

      const response = await this.userService.registro_empresa(companyData).toPromise();
      localStorage.setItem('_id', response.data._id);

      const characteristics: CompanyCharacteristics = {
        empresa: response.data._id,
        techado: false,
        canchas_futsal: 0,
        canchas_voley: 0,
        iluminacion: false,
        garaje: false
      };

      await this.userService.crear_caracteristicas_empresa(
        response.data._id,
        response.token,
        characteristics
      ).toPromise();

      this.toastr.success('Se registró con éxito', 'REGISTRADO!');
      this.router.navigate(['/wait']);
    } catch (error: any) {
      this.toastr.error(error.error?.message || 'Error en el registro');
    } finally {
      this.isLoading = false;
    }
  }
}