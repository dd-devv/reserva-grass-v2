import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { GuestService } from '../../../../services/guest.service';
import { GLOBAL } from '../../../../services/global';
import { catchError, finalize, forkJoin, map, of, switchMap } from 'rxjs';
import { Caracteristica, Empresa, Region } from '../../../general-components/interfaces/interfaces';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
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
  public load_search = false;
  public load_data = true;
  public show_alert_void = false;
  public show_alert_fecha = false;
  public show_card_empresas = false;

  public empresas_ubication: Array<any> = [];
  public primeras_empresas: Array<any> = [];
  public caracPrimeros: Array<any> = [];
  public primerosBuscado: Array<any> = [];

  public busqueda_ubication = '';
  public load_search_ubication = false;
  public load_data_ubication = true;
  public show_alert_void_ubication = false;
  public show_card_empresas_ubication = false;

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
  }

  ngOnInit(): void {

    this.load_data = true;

    this._title.setTitle('Reserva tu Grass');

    this.init_data();

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
    }, 1000);
  }

  handleSearch(opt: string) {
    this.searchOption = opt;
    this.busqueda = '';
    this.ngOnInit();
  }

  init_data() {
    this.show_card_empresas = false;
    this.show_alert_void = false;
  }

  buscarName(): void {
    if (!this.busqueda) {
      this.ngOnInit();
      return;
    }

    this.resetearEstado();
    this.load_search = true;
    this.show_card_empresas = true;

    this._userService.listar_empresas_filtro(this.busqueda).pipe(
      switchMap((response) => {
        if (!response.data?.length) {
          this.show_alert_void = true;
          this.show_card_empresas = false;
          return of(null);
        }
        this.empresas = response.data;
        console.log(this.empresas);

        this.load_data = false;
        return this._userService.obtener_caracteristicas_empresa_publico();
      }),
      map((caracteristicasResponse) => {
        if (!caracteristicasResponse) return;
        const caracteristicas = caracteristicasResponse.data || [];
        this.asignarCaracteristicas(caracteristicas);
      }),
      catchError((error) => {
        console.error('Error en la búsqueda:', error);
        this.show_alert_void = true;
        return of(null);
      }),
      finalize(() => this.load_search = false)
    ).subscribe();
  }

  buscarPorFechaHora(): void {
    if (!this.fecha) {
      this.init_data();
      return;
    }

    this.resetearEstado();
    this.load_search = true;
    this.show_card_empresas = true;

    const fechaHoraFormateada = new Date(this.fecha).toISOString().slice(0, 16);

    this._userService.listar_empresas_con_hora_libre(fechaHoraFormateada).pipe(
      switchMap((response) => {
        if (!response.data?.length) {
          this.show_alert_fecha = true;
          this.show_card_empresas = false;
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
      }),
      catchError((error) => {
        console.error('Error en la búsqueda por fecha y hora:', error);
        this.show_alert_fecha = true;
        return of(null);
      }),
      finalize(() => this.load_search = false)
    ).subscribe();
  }

  private resetearEstado(): void {
    this.show_alert_void = false;
    this.show_alert_fecha = false;
    this.show_card_empresas_ubication = false;
    this.show_alert_void_ubication = false;
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
        });
    });
  }

  select_provincia() {
    // Reset district related state
    this.resetDistrictState();

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
    this.load_search_ubication = true;
    this.busqueda = '';
    this.init_data();
  }

  private resetDistrictState() {
    this.distritos = [];
    this.caracBuscada = [];
    this.isDisabledDistrito = false;
    this.empresa.distrito = '';
  }

  private handleCompaniesResponse(response: any) {
    if (!response?.data) {
      this.showEmptyState();
      return;
    }

    this.showCompaniesData(response.data);
    this.updateCompanyCharacteristics();
  }

  private showEmptyState() {
    this.show_alert_void_ubication = true;
    this.show_card_empresas_ubication = false;
    this.load_search_ubication = false;
  }

  private showCompaniesData(companies: any[]) {
    this.empresas_ubication = companies;
    this.show_card_empresas_ubication = true;
    this.load_data_ubication = false;
    this.show_alert_void_ubication = false;
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

        this.load_search_ubication = false;
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
    this.load_search_ubication = true;
    this.busqueda = '';
    this.init_data();
  }

  private resetProvinciaState() {
    this.distritos = [];
    this.caracBuscada = [];
    this.isDisabledDistrito = false;
    this.empresa.distrito = '';
  }

  private resetDistritoState() {
    this.caracBuscada = [];
    this.load_search_ubication = true;
  }

  private processEmpresasData(empresas: Empresa[] | undefined, caracteristicas: Caracteristica[] | undefined) {
    if (empresas && caracteristicas) {
      this.empresas_ubication = empresas;
      console.log(this.empresas_ubication);

      this.show_card_empresas_ubication = true;
      this.load_data_ubication = false;
      this.show_alert_void_ubication = false;

      this.caracBuscada = this.empresas_ubication.map(empresa =>
        caracteristicas.find(c => c.empresa._id === empresa._id) || null
      );
    } else {
      this.showNoDataAlert();
    }
  }

  private showNoDataAlert() {
    this.show_alert_void_ubication = true;
    this.show_card_empresas_ubication = false;
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    // Implementar manejo de errores apropiado
  }

  changeSearchOption(option: string) {
    this.searchOption = option;
    this.busqueda = '';
    this.fecha = '';
    this.init_data();
  }
}













