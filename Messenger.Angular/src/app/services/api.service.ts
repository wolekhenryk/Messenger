import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from './auth/token.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseApiUrl: string = 'http://localhost:4300/api';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  genericPost<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseApiUrl}/${endpoint}`, body);
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseApiUrl}/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.tokenService.getAccessToken()}`,
      },
    });
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseApiUrl}/${endpoint}`, body, {
      headers: {
        Authorization: `Bearer ${this.tokenService.getAccessToken()}`,
      },
    });
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseApiUrl}/${endpoint}`, body, {
      headers: {
        Authorization: `Bearer ${this.tokenService.getAccessToken()}`,
      },
    });
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseApiUrl}/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.tokenService.getAccessToken()}`,
      },
    });
  }
}
