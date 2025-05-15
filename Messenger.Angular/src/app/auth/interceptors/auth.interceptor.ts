import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../services/auth/token.service';
import {
  NotificationsService,
  NotificationType,
} from '../../services/notifications.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const notifications = inject(NotificationsService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        tokenService.clearTokens();
        notifications.show(
          'Session expired. Please log in again.',
          NotificationType.Warning
        );
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};
