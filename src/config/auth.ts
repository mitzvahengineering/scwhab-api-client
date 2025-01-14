// src/config/auth.ts
const clientId = import.meta.env.VITE_SCHWAB_CLIENT_ID;
const clientSecret = import.meta.env.VITE_SCHWAB_CLIENT_SECRET

export const AUTH_CONFIG = {
  clientId: clientId as string,
  clientSecret: clientSecret as string,
  redirectUri: 'https://127.0.0.1:5173/callback',
  authorizationEndpoint: 'https://api.schwabapi.com/oauth/authorize',
  tokenEndpoint: 'https://api.schwabapi.com/oauth/token',
  apiEndpoint: 'https://api.schwabapi.com/marketdata/v1'
};

if (!clientId) {
  console.error('Client ID is not defined! Check your .env file.');
}