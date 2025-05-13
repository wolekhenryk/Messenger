import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private tokenService: TokenService, private router: Router) {
    this.checkAuth();
  }

  checkAuth(): void {
    if (this.tokenService.hasTokens()) {
      console.log('User is authenticated');
      this.router.navigate(['/']);
    } else {
      console.log('User is not authenticated');
      this.router.navigate(['/register']);
    }
  }
}
