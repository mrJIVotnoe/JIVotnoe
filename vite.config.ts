import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    base: './',
    build: {
      outDir: 'dist',
      sourcemap: false
    },
    define: {
      // Polyfill process.env for SDKs that expect it
      'process.env': env
    }
  }
})