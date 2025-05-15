import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserLogin, UserRegister } from '../../auth/register/register.types';
import { Observable, tap } from 'rxjs';
import { ApiService } from '../api.service';
import { LoginResponse } from './auth.types';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private router: Router,
    private api: ApiService,
    private tokenService: TokenService
  ) {
    this.checkAuth();
  }

  checkAuth(): void {
    const currentUrl = this.router.url;

    // if (!['/register', '/login'].includes(currentUrl)) {
    //   if (this.tokenService.hasTokens()) {
    //     console.log('User is authenticated');
    //     this.router.navigate(['/']);
    //   } else {
    //     console.log('User is not authenticated');
    //     this.router.navigate(['/register']);
    //   }
    // }
  }

  isAuthenticated(): boolean {
    return this.tokenService.hasTokens();
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
