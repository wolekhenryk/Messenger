import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { UserRegister } from '../../auth/register/regisyer.types';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private tokenService: TokenService,
    private router: Router,
    private httpClient: HttpClient
  ) {
    this.checkAuth();
  }

  private apiUrl: string = 'http://localhost:4300/api';

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

  registerUser(userRegister: UserRegister): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/auth/register`, userRegister);
  }
}
