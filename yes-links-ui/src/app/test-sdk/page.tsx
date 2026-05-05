'use client'

/**
 * Dev harness for SDK integration testing (T1.10).
 * Mounts YesLinksProvider + YesLinksDashboard against the local backend.
 * No postMessage, no iframe — pure SDK managed mode.
 */
import { YesLinksProvider } from '@/providers/YesLinksProvider'
import { YesLinksDashboard } from '@/components/YesLinksDashboard'

const BACKEND_URL = process.env.NEXT_PUBLIC_YES_LINKS_BASE_URL ?? 'http://127.0.0.1:8001'
const DEV_TOKEN = process.env.NEXT_PUBLIC_YES_LINKS_TOKEN ?? 'dev-token'

export default function TestSDKPage() {
  return (
    <YesLinksProvider token={DEV_TOKEN} baseUrl={BACKEND_URL} theme="corporate">
      <YesLinksDashboard />
    </YesLinksProvider>
  )
}
