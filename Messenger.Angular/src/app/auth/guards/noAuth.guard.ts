import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export const noAuthGuard: CanActivateFn = (): Observable<
  boolean | import('@angular/router').UrlTree
> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.validateTokenOnce().pipe(
    map((isAuthenticated) => {
      console.log('authGuard final check:', isAuthenticated);
      return !isAuthenticated ? true : router.createUrlTree(['/']);
    })
  );
};
