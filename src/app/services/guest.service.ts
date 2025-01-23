import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  public url;

  constructor(
    private _http: HttpClient
  ) {
    this.url = environment.url;
  }


  obtener_regiones(): Observable<any> {
    return this._http.get('./assets/regiones.json');
  }

  obtener_provincias(): Observable<any> {
    return this._http.get('./assets/provincias.json');
  }

  obtener_distritos(): Observable<any> {
    return this._http.get('./assets/distritos.json');
  }

  obtener_canchas_json(): Observable<any> {
    return this._http.get('./assets/grasses.json');
  }

}
