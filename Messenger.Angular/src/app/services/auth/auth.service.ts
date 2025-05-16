import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserLogin, UserRegister } from '../../auth/register/register.types';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { ApiService } from '../api.service';
import {
  RefreshTokenRequest,
  TokenResponse,
  ValidateTokenRequest,
} from './auth.types';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private router: Router,
    private api: ApiService,
    private tokenService: TokenService
  ) {}

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private refreshIntervalId: any;

  startTokenRefreshScheduler(): void {
    const intervalMs = 59 * 60 * 1000;

    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
    }

    this.refreshIntervalId = setInterval(() => {
      this.refreshToken().subscribe({
        next: (response) => {
          this.tokenService.setAccessToken(response.token);
          this.tokenService.setRefreshToken(response.refreshToken);
          console.log('Token refreshed successfully');
        },
        error: (err) => {
          console.error('Failed to refresh token:', err);
          this.logout();
        },
      });
    }, intervalMs);
  }

  refreshToken(): Observable<TokenResponse> {
    const tokenRequest: RefreshTokenRequest = {
      refreshToken: this.tokenService.getRefreshToken() || '',
    };
    return this.api.post<TokenResponse>('auth/refresh', tokenRequest);
  }

  validateTokenOnce(): Observable<boolean> {
    if (!this.tokenService.hasTokens()) {
      this.isAuthenticatedSubject.next(false);
      return of(false);
    }

    return this.api
      .post<ValidateTokenRequest>('auth/validate', {
        token: this.tokenService.getAccessToken(),
      })
      .pipe(
        map((response: any) => {
          const valid = !!response.valid;
          this.isAuthenticatedSubject.next(valid);
          if (!valid) {
            this.logout();
          }
          return valid;
        }),
        catchError((error) => {
          console.error('Token validation error:', error);
          this.logout();
          this.isAuthenticatedSubject.next(false);
          return of(false);
        })
      );
  }

  logout(): void {
    this.tokenService.clearTokens();
    this.router.navigate(['/login']);
  }

  registerUser(userRegister: UserRegister): Observable<any> {
    return this.api.genericPost('auth/register', userRegister);
  }

  loginUser(userLogin: UserLogin): Observable<any> {
    return this.api.genericPost('auth/login', userLogin).pipe(
      tap((response: any) => {
        this.tokenService.setAccessToken(response.token);
        this.tokenService.setRefreshToken(response.refreshToken);
      })
    );
  }
}
