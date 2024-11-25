import { CanActivateFn, Router } from '@angular/router';
import { PaymentService } from '../services/payment.service';
import { inject } from '@angular/core';
import { map, take } from 'rxjs/operators';

export const paymentGuard: CanActivateFn = (route, state) => {
  const paymentService = inject(PaymentService);
  const router = inject(Router);

  return paymentService.isSuscriptionActive().pipe(
    take(1),
    map(isActive => {
      
      if (!isActive) {
        router.navigate(['/grass/payment']);
        return false;
      }
      
      return true;
    })
  );
};