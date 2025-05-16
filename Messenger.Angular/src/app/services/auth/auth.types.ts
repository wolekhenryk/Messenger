export interface LoginResponse {
  token: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface TokenResponse {
  token: string;
  refreshToken: string;
}

export interface ValidateTokenRequest {
  token: string;
}
