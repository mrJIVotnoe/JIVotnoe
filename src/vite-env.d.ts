
interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Polyfill for process.env to satisfy TypeScript in components utilizing the legacy/compatibility layer
declare namespace NodeJS {
  interface ProcessEnv {
    readonly VITE_GEMINI_API_KEY: string;
    readonly API_KEY: string;
    readonly NODE_ENV: 'development' | 'production' | 'test';
  }
}