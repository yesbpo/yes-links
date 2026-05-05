/**
 * main.tsx — Vite entry point for yes-links-demo
 *
 * Mounts the app inside YesLinksProvider so every hook and
 * managed component lower in the tree can read token + baseUrl
 * from context without receiving them as explicit props.
 *
 * BASE_URL and TOKEN come from Vite env variables set by Playwright's
 * webServer.env; in normal dev they fall back to config.ts defaults.
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { YesLinksProvider } from '@yes/links-ui'
import '@yes/links-ui/style.css'
import { App } from './App'
import { BASE_URL, TOKEN, DEFAULT_THEME } from './config'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <YesLinksProvider token={TOKEN} baseUrl={BASE_URL} theme={DEFAULT_THEME}>
      <App />
    </YesLinksProvider>
  </React.StrictMode>,
)
