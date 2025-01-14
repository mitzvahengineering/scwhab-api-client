/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SCHWAB_CLIENT_ID: string
    readonly VITE_SCHWAB_CLIENT_SECRET: string
    // Add other env variables here if needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }