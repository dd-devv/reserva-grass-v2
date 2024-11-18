import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GuestService } from '../../../../services/guest.service';
import { UserService } from '../../../../services/user.service';
import { GLOBAL } from '../../../../services/global';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { Caracteristica, Empresa, Region } from '../../../general-components/interfaces/interfaces';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  public searchOption: string = 'name';

  public empresa: any = {
    region: '',
    provincia: '',
    distrito: '',
  };

  public token: any;
  public id: any;
  public user: any;
  public user_lc: any;
  public url: any;

  public regiones: Array<any> = [];
  public namereg = '';
  public provincias: Array<any> = [];
  public nameprov = '';
  public distritos: Array<any> = [];

  public provincias_arr: Array<any> = [];
  public distritos_arr: Array<any> = [];

  public empresas: Array<any> = [];
  public caracteristicas: Array<any> = [];
  public caracBuscada: Array<any> = [];
  public busqueda = '';
  public fecha = '';
  public load_data = true;

  public empresas_ubication: Array<any> = [];
  public primeras_empresas: Array<any> = [];
  public caracPrimeros: Array<any> = [];
  public primerosBuscado: Array<any> = [];

  public busqueda_ubication = '';

  isDisabledProvincia = true;
  isDisabledDistrito = true;
  public reviews: Array<any> = [];
  public reviewsDestacados: Array<any> = [];

  p: number = 1;

  public imagen_fondo: String = '';

  texto: string = '';

  constructor(
    private _title: Title,
    private _guestService: GuestService,
    private _userService: UserService
  ) {

    this.url = GLOBAL.url;
    this.user_lc = undefined;

    this.token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');
    localStorage.removeItem('id_cancha');
    localStorage.removeItem('afuera');
  }

  ngOnInit(): void {

    this.load_data = true;

    this._title.setTitle('Reserva tu Grass');

    forkJoin({
      regiones: this._guestService.obtener_regiones(),
      empresas: this._userService.listar_empresas_publico(),
      caracteristicas:
        this._userService.obtener_caracteristicas_empresa_publico(),
    })
      .pipe(
        map(({ regiones, empresas, caracteristicas }) => ({
          regiones: regiones.map(({ id, name }: Region) => ({ id, name })),
          empresas: empresas.data || [],
          caracteristicas: caracteristicas.data || [],
        }))
      )
      .subscribe({
        next: ({ regiones, empresas, caracteristicas }) => {
          this.regiones = regiones;
          this.primeras_empresas = empresas;

          this.caracBuscada = empresas.map(
            (empresa: { _id: any; }) =>
              caracteristicas.find(
                (carac: { empresa: { _id: any; }; }) => carac.empresa._id === empresa._id
              ) || null
          );
        },
        error: (err) => console.error('Error al cargar datos', err),
      });

    setTimeout(() => {
      this.load_data = false;
    }, 500);
  }

  handleSearch(opt: string) {
    this.searchOption = opt;
    this.busqueda = '';
    this.ngOnInit();
  }

  buscarName(): void {
    if (!this.busqueda) {
      this.ngOnInit();
      return;
    }

    this.resetearEstado();
    this.load_data = true;

    this._userService.listar_empresas_filtro(this.busqueda).pipe(
      switchMap((response) => {
        if (!response.data?.length) {
          return of(null);
        }
        this.empresas = response.data;

        return this._userService.obtener_caracteristicas_empresa_publico();
      }),
      map((caracteristicasResponse) => {
        if (!caracteristicasResponse) return;
        const caracteristicas = caracteristicasResponse.data || [];
        this.asignarCaracteristicas(caracteristicas);

        setTimeout(() => {
          this.load_data = false;
        }, 500);
      })).subscribe();
  }

  buscarPorFechaHora(): void {
    if (!this.fecha) {
      return;
    }

    this.resetearEstado();

    const fechaHoraFormateada = new Date(this.fecha).toISOString().slice(0, 16);

    this._userService.listar_empresas_con_hora_libre(fechaHoraFormateada).pipe(
      switchMap((response) => {
        if (!response.data?.length) {
          return of(null);
        }
        this.empresas = response.data;
        this.load_data = false;
        return this._userService.obtener_caracteristicas_empresa_publico();
      }),
      map((caracteristicasResponse) => {
        if (!caracteristicasResponse) return;
        const caracteristicas = caracteristicasResponse.data || [];
        this.asignarCaracteristicas(caracteristicas);
      })).subscribe();
  }

  private resetearEstado(): void {
    this.caracBuscada = [];
    this.empresas = [];
  }

  private asignarCaracteristicas(caracteristicas: any): void {
    this.caracBuscada = this.empresas.map(empresa =>
      caracteristicas.find((carac: { empresa: { _id: any; }; }) => carac.empresa._id === empresa._id) || null
    );

    this.primerosBuscado = this.caracBuscada;
  }

  select_region() {
    // Reset initial state
    this.resetInitialState();
    this.load_data = true;

    // Get provinces for selected region
    this._guestService.obtener_provincias().subscribe(response => {
      this.provincias = response.filter((element: { department_id: any; }) =>
        element.department_id === this.empresa.region
      );

      const regionFound = this.regiones.find(
        objeto => objeto.id === this.empresa.region
      );

      if (!regionFound) return;
      this.namereg = regionFound.name;

      // Get companies for region
      this._userService.listar_empresas_region(this.namereg)
        .subscribe(response => {
          this.handleCompaniesResponse(response);

          setTimeout(() => {
            this.load_data = false;
          }, 500);
        });
    });
  }

  select_provincia() {
    // Reset district related state
    this.resetDistrictState();
    this.load_data = true;

    // Get districts for selected province
    this._guestService.obtener_distritos().subscribe(response => {
      this.distritos = response.filter((element: { province_id: any; }) =>
        element.province_id === this.empresa.provincia
      );

      const provinceFound = this.provincias.find(
        objeto => objeto.id === this.empresa.provincia
      );

      if (!provinceFound) return;
      this.nameprov = provinceFound.name;

      // Get companies for province
      this._userService.listar_empresas_prov(this.namereg, this.nameprov)
        .subscribe(response => {
          this.handleCompaniesResponse(response);

          setTimeout(() => {
            this.load_data = false;
          }, 500);
        });
    });
  }

  select_distrito() {
    // Get companies for district
    this._userService.listar_empresas_dist(
      this.namereg,
      this.nameprov,
      this.empresa.distrito
    ).subscribe(response => {
      this.handleCompaniesResponse(response);
    });
  }

  private resetInitialState() {
    this.provincias = [];
    this.distritos = [];
    this.caracBuscada = [];
    this.isDisabledProvincia = false;
    this.isDisabledDistrito = true;
    this.empresa.provincia = '';
    this.nameprov = '';
    this.empresa.distrito = '';
    this.busqueda = '';
  }

  private resetDistrictState() {
    this.distritos = [];
    this.caracBuscada = [];
    this.isDisabledDistrito = false;
    this.empresa.distrito = '';
  }

  private handleCompaniesResponse(response: any) {
    if (!response?.data) {
      return;
    }

    this.showCompaniesData(response.data);
    this.updateCompanyCharacteristics();
  }

  private showCompaniesData(companies: any[]) {
    this.empresas_ubication = companies;
  }

  private updateCompanyCharacteristics() {
    this._userService.obtener_caracteristicas_empresa_publico()
      .subscribe(response => {
        if (!response?.data) return;

        this.caracteristicas = response.data;
        this.caracBuscada = this.empresas_ubication.map(empresa => {
          return this.caracteristicas.find(
            caracteristica => caracteristica.empresa._id === empresa._id
          ) || null;
        });
      });
  }

  private resetState() {
    this.provincias = [];
    this.distritos = [];
    this.caracBuscada = [];
    this.isDisabledProvincia = false;
    this.isDisabledDistrito = true;
    this.empresa.provincia = '';
    this.nameprov = '';
    this.empresa.distrito = '';
    this.busqueda = '';
  }

  private resetProvinciaState() {
    this.distritos = [];
    this.caracBuscada = [];
    this.isDisabledDistrito = false;
    this.empresa.distrito = '';
  }

  private resetDistritoState() {
    this.caracBuscada = [];
  }

  private processEmpresasData(empresas: Empresa[] | undefined, caracteristicas: Caracteristica[] | undefined) {
    if (empresas && caracteristicas) {
      this.empresas_ubication = empresas;
      console.log(this.empresas_ubication);

      this.caracBuscada = this.empresas_ubication.map(empresa =>
        caracteristicas.find(c => c.empresa._id === empresa._id) || null
      );
    }
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    // Implementar manejo de errores apropiado
  }

  changeSearchOption(option: string) {
    this.searchOption = option;
    this.busqueda = '';
    this.fecha = '';
  }
}
