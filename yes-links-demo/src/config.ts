/**
 * Demo app configuration — single source of truth.
 *
 * Values read from Vite env variables with safe fallbacks.
 * Playwright's webServer.env passes VITE_API_BASE_URL and VITE_API_TOKEN
 * so tests can override without touching source.
 */

export const BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://127.0.0.1:8001'

export const TOKEN: string =
  (import.meta.env.VITE_API_TOKEN as string | undefined) ?? 'demo-token'

export const DEFAULT_THEME = 'corporate' as const
