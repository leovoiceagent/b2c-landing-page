/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RETELL_API_KEY: string;
  readonly VITE_HVAC_AGENT_ID: string;
  readonly VITE_N8N_WEBHOOK_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Google Ads gtag
declare function gtag(...args: unknown[]): void;
