import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  public url;

  constructor(
    private _http: HttpClient
  ) {
    this.url = GLOBAL.url;
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

}