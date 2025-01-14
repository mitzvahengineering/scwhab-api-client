// src/config/auth.ts
export const AUTH_CONFIG = {
    clientId: process.env.VITE_SCHWAB_CLIENT_ID as string,
    clientSecret: process.env.VITE_SCHWAB_CLIENT_SECRET as string,
    redirectUri: 'https://127.0.0.1:5173/callback', // Update this to match your Vite dev server port
    authorizationEndpoint: 'https://api.schwab.com/oauth/authorize', // Replace with actual Schwab auth endpoint
    tokenEndpoint: 'https://api.schwab.com/oauth/token', // Replace with actual Schwab token endpoint
    scope: 'options_chain', // Replace with actual required scope
  };