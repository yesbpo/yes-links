/**
 * useLinks — fetches links via the SDK apiClient.
 * TF:YL-S1-T6
 *
 * Token + baseUrl flow from YesLinksProvider via useYesLinks().
 */
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { Link } from '@/components/LinkCard'
import { withTrace } from '@/lib/tracing'
import { createApiClient, type ClientScope } from '@/lib/apiClient'
import { useYesLinks } from '@/providers/YesLinksProvider'

type State = 'idle' | 'loading' | 'success' | 'error'

export interface UseLinksParams {
  tags?: string
  campaign?: string
  search?: string
  limit?: number
  /** When false the hook skips fetching (used when dataSource is provided externally). */
  enabled?: boolean
  /** Scope all fetches to a specific client's data subset */
  clientScope?: ClientScope
}

interface UseLinksResult {
  links: Link[]
  state: State
  error: Error | null
  mutate: () => Promise<void>
}

export const useLinks = (params: UseLinksParams = {}): UseLinksResult => {
  const { token, baseUrl } = useYesLinks()

  const [links, setLinks] = useState<Link[]>([])
  const [state, setState] = useState<State>('idle')
  const [error, setError] = useState<Error | null>(null)

  const abortControllerRef = useRef<AbortController | null>(null)

  // Stable client reference — only recreates when token/baseUrl change
  const client = useMemo(() => {
    if (!token) return null
    return createApiClient({ token, baseUrl })
  }, [token, baseUrl])

  const limit = params.limit ?? 20
  const { tags, campaign, search, enabled = true, clientScope } = params

  const fetchLinks = useCallback(async () => {
    if (!client || !enabled) return

    // Abort any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    setState('loading')
    setError(null)

    await withTrace(
      'useLinks.fetch',
      { tags: tags || 'none', campaign: campaign || 'none', limit },
      async () => {
        try {
          const data = (await client.getLinks({ campaign, tags, search, limit, clientScope })) as {
            items: Link[]
            total: number
          }

          if (!abortController.signal.aborted) {
            setLinks(data.items || [])
            setState('success')
          }
        } catch (err: unknown) {
          if ((err as { name?: string }).name === 'AbortError') return
          if (!abortController.signal.aborted) {
            setState('error')
            setError(err instanceof Error ? err : new Error(String(err)))
          }
        }
      }
    )
  }, [client, tags, campaign, search, limit, enabled, clientScope])

  useEffect(() => {
    fetchLinks()
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [fetchLinks])

  return { links, state, error, mutate: fetchLinks }
}
