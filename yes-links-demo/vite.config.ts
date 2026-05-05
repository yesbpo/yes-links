/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    strictPort: true, // fail fast if port is occupied — prevents silent CORS misconfiguration
  },

  resolve: {
    // Prevent dual-React instances when @yes/links-ui is resolved via file: symlink.
    // React hook state is module-level; two copies = "Invalid hook call" at runtime.
    dedupe: ['react', 'react-dom'],
  },

  test: {
    environment: 'node', // SDK surface tests: no DOM needed
    globals: true,
    include: ['src/__tests__/**/*.test.{ts,tsx}'],
  },
})
