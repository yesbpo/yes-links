import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false, // demos run sequentially for determinism
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'line',

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    env: {
      VITE_API_BASE_URL: 'http://127.0.0.1:8001',
      VITE_API_TOKEN: 'demo-token',
    },
    timeout: 30_000,
  },
})
