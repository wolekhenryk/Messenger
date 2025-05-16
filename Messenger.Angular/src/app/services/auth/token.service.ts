import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private accessTokenSubject = new BehaviorSubject<string | null>(null);
  public readonly accessToken$ = this.accessTokenSubject.asObservable();

  private refreshToken: string | null = null;

  constructor() {
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.accessTokenSubject.next(token);
    }
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  setAccessToken(token: string) {
    localStorage.setItem('accessToken', token);
    this.accessTokenSubject.next(token);
  }

  getAccessToken(): string | null {
    return this.accessTokenSubject.value;
  }

  setRefreshToken(token: string) {
    this.refreshToken = token;
    localStorage.setItem('refreshToken', token);
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.accessTokenSubject.next(null);
    this.refreshToken = null;
  }

  hasTokens(): boolean {
    return !!this.accessTokenSubject.value && !!this.refreshToken;
  }
}
