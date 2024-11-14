import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authenticatedUserGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticatedUser()) {
    router.navigate(['/usuario']);
    return false;
  }

  if (authService.isAuthenticatedGrass()) {
    router.navigate(['/grass']);
    return false;
  }

  if (authService.isAuthenticatedAdmin()) {
    router.navigate(['/admin']);
    return false;
  }

  return true;
};
