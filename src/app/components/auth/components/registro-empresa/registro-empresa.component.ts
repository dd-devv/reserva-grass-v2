import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { GuestService } from '../../../../services/guest.service';
import { UserService } from '../../../../services/user.service';
import { ToastrService } from 'ngx-toastr';

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
  registrationForm: FormGroup = this.createRegistrationForm();
  characteristicsForm: FormGroup = this.createCharacteristicsForm();

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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private title: Title,
    private guestService: GuestService,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    this.loadRegions();
  }

  ngOnInit(): void {
    this.title.setTitle('Registro de empresas');
  }

  private createRegistrationForm(): FormGroup {
    return this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      telefono_fijo: [''],
      region: ['', Validators.required],
      provincia: ['', Validators.required],
      distrito: ['', Validators.required],
      ubicacion: ['', Validators.required],
      referencia: [''],
      horario_atencion: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  private createCharacteristicsForm(): FormGroup {
    return this.fb.group({
      techado: [false],
      canchas_futsal: [0, [Validators.min(0)]],
      canchas_voley: [0, [Validators.min(0)]],
      iluminacion: [false],
      garaje: [false]
    });
  }

  private passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
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
        ...this.characteristicsForm.value
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

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}