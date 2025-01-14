// src/services/auth.ts
import { AUTH_CONFIG } from '../config/auth';

export class AuthService {
  private static instance: AuthService;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private expiresAt: number = 0;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  initiateOAuthFlow(): void {
    const state = this.generateRandomState();
    localStorage.setItem('oauth_state', state);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: AUTH_CONFIG.clientId,
      redirect_uri: AUTH_CONFIG.redirectUri,
      scope: AUTH_CONFIG.scope,
      state: state,
    });

    window.location.href = `${AUTH_CONFIG.authorizationEndpoint}?${params.toString()}`;
  }

  async handleCallback(code: string, state: string): Promise<boolean> {
    const savedState = localStorage.getItem('oauth_state');
    if (state !== savedState) {
      throw new Error('OAuth state mismatch');
    }

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: AUTH_CONFIG.redirectUri,
      client_id: AUTH_CONFIG.clientId,
      client_secret: AUTH_CONFIG.clientSecret,
    });

    try {
      const response = await fetch(AUTH_CONFIG.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (!response.ok) {
        throw new Error('Token exchange failed');
      }

      const data = await response.json();
      this.setTokens(data);
      return true;
    } catch (error) {
      console.error('Token exchange error:', error);
      return false;
    }
  }

  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) {
      return false;
    }

    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: this.refreshToken,
      client_id: AUTH_CONFIG.clientId,
      client_secret: AUTH_CONFIG.clientSecret,
    });

    try {
      const response = await fetch(AUTH_CONFIG.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      this.setTokens(data);
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  private setTokens(data: any): void {
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token;
    this.expiresAt = Date.now() + (data.expires_in * 1000);
  }

  getAccessToken(): string | null {
    if (this.accessToken && Date.now() < this.expiresAt) {
      return this.accessToken;
    }
    return null;
  }

  private generateRandomState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export const authService = AuthService.getInstance();