'use client'

/**
 * Dev harness for clientScope + mode E2E testing.
 *
 * Renders two dashboards side-by-side:
 *   - internal mode  (full form — campaign + tags editable)
 *   - external mode  (locked form — campaign + tags hidden, taken from clientScope)
 *
 * Query params control the scenario so Playwright can vary them without
 * needing separate pages:
 *   ?mode=internal|external
 *   ?campaign=<value>
 *   ?tags=<comma-separated>
 */
import { useSearchParams } from 'next/navigation'
import { YesLinksProvider } from '@/providers/YesLinksProvider'
import { YesLinksDashboard } from '@/components/YesLinksDashboard'
import type { ClientScope } from '@/lib/apiClient'

const BACKEND_URL = process.env.NEXT_PUBLIC_YES_LINKS_BASE_URL ?? 'http://127.0.0.1:8001'
const DEV_TOKEN = process.env.NEXT_PUBLIC_YES_LINKS_TOKEN ?? 'dev-token'

export default function TestSDKScopePage() {
  const params = useSearchParams()
  const mode = (params.get('mode') ?? 'internal') as 'internal' | 'external'
  const campaign = params.get('campaign') ?? undefined
  const tagsRaw = params.get('tags')
  const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : undefined

  const clientScope: ClientScope | undefined =
    campaign || tags ? { campaign, tags } : undefined

  return (
    <YesLinksProvider token={DEV_TOKEN} baseUrl={BACKEND_URL} theme="corporate">
      <div data-testid="scope-harness">
        <YesLinksDashboard
          clientScope={clientScope}
          mode={mode}
        />
      </div>
    </YesLinksProvider>
  )
}
