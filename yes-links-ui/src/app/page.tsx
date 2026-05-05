'use client'

import { YesLinksProvider } from '@/providers/YesLinksProvider'
import { YesLinksDashboard } from '@/components/YesLinksDashboard'

const BACKEND_URL = process.env.NEXT_PUBLIC_YES_LINKS_BASE_URL ?? 'http://127.0.0.1:8001'
const TOKEN = process.env.NEXT_PUBLIC_YES_LINKS_TOKEN ?? 'dev-token'

export default function Home() {
  return (
    <YesLinksProvider token={TOKEN} baseUrl={BACKEND_URL} theme="corporate">
      <YesLinksDashboard />
    </YesLinksProvider>
  )
}
