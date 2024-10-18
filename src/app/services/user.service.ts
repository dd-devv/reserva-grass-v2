import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public url;

  constructor(
    private _http: HttpClient
  ) {
    this.url = GLOBAL.url;
  }

  //USER
  registro_user(data: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.post(this.url + 'registro_user', data, { headers: headers });
  }

  enviar_correo_confirmacion(id: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.get(this.url + 'enviar_correo_confirmacion/' + id, { headers: headers });
  }


  login_user(data: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'login_user', data, { headers: headers });
  }

  actualizar_user_verificado(id: any, codigo: any): Observable<any> {
    return this._http.put(this.url + 'actualizar_user_verificado/' + id + '/' + codigo, { data: true });
  }

  obtener_user(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'obtener_user/' + id, { headers: headers });
  }

  actualizar_user(id: any, data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.put(this.url + 'actualizar_user/' + id, data, { headers: headers });
  }

  comparar_password(data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.post(this.url + 'comparar_password', data, { headers: headers });
  }

  actualizar_password_user(id: any, data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.put(this.url + 'actualizar_password_user/' + id, data, { headers: headers });
  }

  eliminar_cuenta_user(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.delete(this.url + 'eliminar_cuenta_user/' + id, { headers: headers });
  }

  registro_token_cambio_pass(data: any): Observable<any> {
    return this._http.put(this.url + 'registro_token_cambio_pass', data);
  }

  enviar_correo_token_cambio_pass(correo: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.get(this.url + 'enviar_correo_token_cambio_pass/' + correo, { headers: headers });
  }

  verificar_token_cambio_pass(token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.get(this.url + 'verificar_token_cambio_pass/' + token, { headers: headers });
  }

  cambiar_password_user(data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.put(this.url + 'cambiar_password_user/' + token, data, { headers: headers });
  }

  //EMPRESA
  registro_empresa(data: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.post(this.url + 'registro_empresa', data, { headers: headers });
  }

  login_empresa(data: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'login_empresa', data, { headers: headers });
  }

  obtener_empresa(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'obtener_empresa/' + id, { headers: headers });
  }

  obtener_empresa_publico(id: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    return this._http.get(this.url + 'obtener_empresa_publico/' + id, { headers: headers });
  }

  listar_empresas_filtro(filtro: any): Observable<any> {
    return this._http.get(this.url + 'listar_empresas_filtro/' + filtro);
  }

  listar_empresas_con_hora_libre(fecha_hora: string): Observable<any> {
    return this._http.get(this.url + 'listar_empresas_con_hora_libre/' + fecha_hora);
  }

  listar_empresas_region(region: any): Observable<any> {
    return this._http.get(this.url + 'listar_empresas_region/' + region);
  }

  listar_empresas_prov(region: any, provincia: any): Observable<any> {
    return this._http.get(this.url + 'listar_empresas_prov/' + region + '/' + provincia);
  }

  listar_empresas_dist(region: any, provincia: any, distrito: any): Observable<any> {
    return this._http.get(this.url + 'listar_empresas_dist/' + region + '/' + provincia +  '/' + distrito);
  }

  actualizar_empresa(id: any, data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.put(this.url + 'actualizar_empresa/' + id, data, { headers: headers });
  }

  crear_caracteristicas_empresa(id: any, token: any, data: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.post(this.url + 'crear_caracteristicas_empresa/' + id, data, { headers: headers });
  }

  obtener_caracteristicas_empresa(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'obtener_caracteristicas_empresa/' + id, { headers: headers });
  }

  obtener_caracteristicas_empresa_publico(): Observable<any> {
    return this._http.get(this.url + 'obtener_caracteristicas_empresa_publico');
  }
  
  listar_empresas_publico(): Observable<any> {
    return this._http.get(this.url + 'listar_empresas_publico');
  }

  listar_empresas_user(region: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'listar_empresas_user/' + region, { headers: headers });
  }

  actualizar_caracteristicas_empresa(id: any, token: any, data: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.put(this.url + 'actualizar_caracteristicas_empresa/' + id, data, { headers: headers });
  }

  //Canchas
  crear_cancha_empresa(id: any, token: any, data: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.post(this.url + 'crear_cancha_empresa/' + id, data, { headers: headers });
  }

  obtener_canchas_empresa(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'obtener_canchas_empresa/' + id, { headers: headers });
  }

  obtener_canchas(id: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    return this._http.get(this.url + 'obtener_canchas/' + id);
  }

  obtener_cancha_empresa(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'obtener_cancha_empresa/' + id, { headers: headers });
  }

  obtener_cancha_publico(id: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.get(this.url + 'obtener_cancha_publico/' + id, { headers: headers });
  }

  actualizar_cancha_empresa(id: any, data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.put(this.url + 'actualizar_cancha_empresa/' + id, data, { headers: headers });
  }

  eliminar_cancha_empresa(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.delete(this.url + 'eliminar_cancha_empresa/' + id, { headers: headers });
  }

  //Reservaciones
  registro_reservacion_grass(data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.post(this.url + 'registro_reservacion_grass', data, { headers: headers });
  }

  actualizar_reserva_total_grass(id: any, total: number, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.put(this.url + 'actualizar_reserva_total_grass/' + id, {data: total}, {headers: headers});
  }

  obtener_reservaciones_empresa(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'obtener_reservaciones_empresa/' + id, { headers: headers });
  }

  obtener_reservacion_empresa(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'obtener_reservacion_empresa/' + id, { headers: headers });
  }

  actualizar_reserva_reservado_empresa(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.put(this.url + 'actualizar_reserva_reservado_empresa/' + id, { data: true }, {headers: headers});
  }


  obtener_clientes_empresa(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'obtener_clientes_empresa/' + id, { headers: headers });
  }

  eliminar_reservacion_empresa(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.delete(this.url + 'eliminar_reservacion_empresa/' + id, { headers: headers });
  }

  obtener_reservaciones_admin(token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'obtener_reservaciones_admin', { headers: headers });
  }

  obtener_reservacion_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'obtener_reservacion_admin/' + id, { headers: headers });
  }

  actualizar_reserva_reservado_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.put(this.url + 'actualizar_reserva_reservado_admin/' + id, { data: true }, {headers: headers});
  }

  //SUSCRIPCIONES
  registro_suscripcion_prueba(data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.post(this.url + 'registro_suscripcion_prueba', data, { headers: headers });
  }

  registro_suscripcion_empresa(data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.post(this.url + 'registro_suscripcion_empresa', data, { headers: headers });
  }

  obtener_suscripciones_empresa(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'obtener_suscripciones_empresa/' + id, { headers: headers });
  }

  obtener_suscripciones_admin(token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'obtener_suscripciones_admin', { headers: headers });
  }

  obtener_suscripcion_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'obtener_suscripcion_admin/' + id, { headers: headers });
  }

  actualizar_suscripcion_confirmado_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.put(this.url + 'actualizar_suscripcion_confirmado_admin/' + id, { data: true }, {headers: headers});
  }

  //KPI
  kpi_ganancias_mensuales_grass(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'kpi_ganancias_mensuales_grass/' + id, { headers: headers });
  }

  //Cuentas
  registro_cuenta_grass(data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.post(this.url + 'registro_cuenta_grass', data, { headers: headers });
  }

  obtener_cuenta_grass(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'obtener_cuenta_grass/' + id, { headers: headers });
  }

  obtener_cuentas_grass(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'obtener_cuentas_grass/' + id, { headers: headers });
  }

  eliminar_cuenta_grass(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.delete(this.url + 'eliminar_cuenta_grass/' + id, { headers: headers });
  }

  actualizar_cuenta_grass(id: any, data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.put(this.url + 'actualizar_cuenta_grass/' + id, data, { headers: headers });
  }

  obtener_cuentas(token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'obtener_cuentas', { headers: headers });
  }

  obtener_cuentas_de_grass(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'obtener_cuentas_de_grass/' + id, { headers: headers });
  }

  //CUENTAS ADMIN
  registro_cuenta_admin(data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.post(this.url + 'registro_cuenta_admin', data, { headers: headers });
  }

  obtener_cuenta_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'obtener_cuenta_admin/' + id, { headers: headers });
  }

  obtener_cuentas_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'obtener_cuentas_admin/' + id, { headers: headers });
  }

  eliminar_cuenta_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.delete(this.url + 'eliminar_cuenta_admin/' + id, { headers: headers });
  }

  actualizar_cuenta_admin(id: any, data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.put(this.url + 'actualizar_cuenta_admin/' + id, data, { headers: headers });
  }

  obtener_cuentas_de_admin(token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'obtener_cuentas_de_admin', { headers: headers });
  }

  ////EMPRESA
  obtener_empresas_admin(token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'obtener_empresas_admin', { headers: headers });
  }

  actualizar_empresa_verificado_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.put(this.url + 'actualizar_empresa_verificado_admin/' + id, { data: true }, {headers: headers});
  }

  obtener_caracteristicas_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'obtener_caracteristicas_admin/' + id, { headers: headers });
  }

  eliminar_empresa_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.delete(this.url + 'eliminar_empresa_admin/' + id, { headers: headers });
  }

  obtener_cuentas_de_empresa_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'obtener_cuentas_de_empresa_admin/' + id, { headers: headers });
  }

  /////CLIENTES
  obtener_clientes_admin(token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'obtener_clientes_admin', { headers: headers });
  }

  /////KPI ADMIN
  kpi_ganancias_mensuales_admin(token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'kpi_ganancias_mensuales_admin', { headers: headers });
  }

  //Galería
  agregar_imagen_galeria_cancha(id: any, data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'authorization': token });
    const fd = new FormData();
    fd.append('_id', data._id);

    fd.append('imagen', data.imagen);
    return this._http.put(this.url + 'agregar_imagen_galeria_cancha/' + id, fd, { headers: headers });
  }

  eliminar_imagen_galeria_cancha(id: any, data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.put(this.url + 'eliminar_imagen_galeria_cancha/' + id, data, { headers: headers });
  }

  //Portada
  agregar_imagen_portada(id: any, data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'authorization': token });
    const fd = new FormData();
    fd.append('_id', data._id);

    fd.append('imagen', data.imagen);
    return this._http.put(this.url + 'agregar_imagen_portada/' + id, fd, { headers: headers });
  }

  eliminar_imagen_portada(id: any, data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.put(this.url + 'eliminar_imagen_portada/' + id, data, { headers: headers });
  }

  //Reservacion
  crear_reservacion_user(data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.post(this.url + 'crear_reservacion_user', data, { headers: headers });
  }

  obtener_reservaciones_user(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'obtener_reservaciones_user/' + id, { headers: headers });
  }

  obtener_reservaciones_public(id: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.get(this.url + 'obtener_reservaciones_public/' + id, { headers: headers });
  }

  //MENSAJES
  enviar_mensaje_contacto(data: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'enviar_mensaje_contacto', data, { headers: headers });
  }

  obtener_mensajes_admin(token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'obtener_mensajes_admin', { headers: headers });
  }

  cerrar_mensaje_admin(id: any, data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.put(this.url + 'cerrar_mensaje_admin/' + id, data, { headers: headers });
  }


  public isAutenticatedUser(): Boolean {

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {
      return false;
    }

    try {
      const helper = new JwtHelperService();
      var decodedToken = helper.decodeToken(<any>token);

      if (helper.isTokenExpired(token)) {
        localStorage.clear();
        return false;
      }

      if (!decodedToken) {
        localStorage.clear();
        return false;
      }
    } catch (error) {
      localStorage.clear();
      return false;
    }

    return true;
  }

  public isAutenticatedAdmin(): Boolean {

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {
      return false;
    }

    try {
      const helper = new JwtHelperService();
      var decodedToken = helper.decodeToken(<any>token);

      if (helper.isTokenExpired(token)) {
        localStorage.clear();
        return false;
      }

      if (!decodedToken) {
        localStorage.clear();
        return false;
      }

      if (decodedToken.role !== 'ADMIN') {
        return false;
      }

    } catch (error) {
      localStorage.clear();
      return false;
    }

    if (decodedToken.role == 'ADMIN') {
      return true;
    }

    return true;
  }

  public isAutenticatedGrass(): Boolean {

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {
      return false;
    }

    try {
      const helper = new JwtHelperService();
      var decodedToken = helper.decodeToken(<any>token);

      if (helper.isTokenExpired(token)) {
        localStorage.clear();
        return false;
      }

      if (!decodedToken) {
        localStorage.clear();
        return false;
      }

      if (decodedToken.role !== 'GRASS') {
        return false;
      }

    } catch (error) {
      localStorage.clear();
      return false;
    }

    if (decodedToken.role == 'GRASS') {
      return true;
    }

    return true;
  }

}