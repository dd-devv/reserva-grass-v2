import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private jwtHelper = new JwtHelperService();

  constructor(
    private router: Router,
    private userService: UserService,
    private http: HttpClient
  ) {}

  public isAuthenticatedByRole(requiredRole: string): boolean {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {
      return false;
    }

    try {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);

      if (helper.isTokenExpired(token) || !decodedToken) {
        this.clearStorage();
        return false;
      }

      return decodedToken.role === requiredRole;
    } catch (error) {
      this.clearStorage();
      return false;
    }
  }
 
  
  public isAuthenticatedUser(): boolean {
    return this.isAuthenticatedByRole('USER');
  }

  public isAuthenticatedAdmin(): boolean {
    return this.isAuthenticatedByRole('ADMIN');
  }

  public isAuthenticatedGrass(): boolean {
    return this.isAuthenticatedByRole('GRASS');
  }

  public logout(): void {
    this.clearStorage();
    this.router.navigate(['/']);
  }

  public clearStorage(): void {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('_id');
    sessionStorage.removeItem('_id');
    localStorage.removeItem('celular');
    localStorage.removeItem('empresa');
    sessionStorage.removeItem('empresa');
  }
}
