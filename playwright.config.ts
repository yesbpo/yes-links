import { defineConfig } from '@playwright/test';

const port = Number(process.env.UI_TEST_PORT || '8001');
const baseURL = process.env.UI_BASE_URL || `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './tests/ui',
  timeout: 45_000,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `sh -c "alembic upgrade head && uvicorn src.main:app --host 127.0.0.1 --port ${port}"`,
    url: `${baseURL}/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
