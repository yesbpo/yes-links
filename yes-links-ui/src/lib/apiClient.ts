/**
 * Internal API client factory for @yes/links-ui SDK.
 * TF:YL-S1-T5
 *
 * Usage:
 *   const client = createApiClient({ token, baseUrl })
 *   const links = await client.getLinks({ campaign: 'summer' })
 */

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function generateRequestId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function buildUrl(
  baseUrl: string,
  path: string,
  params?: Record<string, string | number | undefined | null>
): URL {
  const url = new URL(path, baseUrl.endsWith('/') ? baseUrl : baseUrl + '/')
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value))
      }
    }
  }
  return url
}

/** Append a string[] as repeated `key[]=value` params (does not double-encode). */
function appendArrayParam(url: URL, key: string, values: string[] | undefined): void {
  if (!values || values.length === 0) return
  for (const v of values) {
    url.searchParams.append(`${key}[]`, v)
  }
}

async function request<T>(
  url: string,
  options: RequestInit & { headers?: Record<string, string> }
): Promise<T> {
  const response = await fetch(url, options)
  let body: unknown
  try {
    body = await response.json()
  } catch {
    body = null
  }

  if (!response.ok) {
    const message =
      typeof body === 'object' && body !== null && 'detail' in body
        ? String((body as { detail: string }).detail)
        : `HTTP ${response.status}`
    throw new ApiError(response.status, message, body)
  }

  return body as T
}

// ── Public types ──────────────────────────────────────────────────────────────

/**
 * Scopes all data fetches to a specific client's subset.
 * Pass this to YesLinksDashboard, useLinks, or useStats to filter
 * API results without exposing the entire database to a consumer.
 */
export interface ClientScope {
  /** Filter by campaign name */
  campaign?: string
  /** Filter by one or more tags (OR logic — links matching any tag are returned) */
  tags?: string[]
}

export interface GetLinksParams {
  campaign?: string
  tags?: string
  search?: string
  limit?: number
  offset?: number
  /** Scope applied at the API level — takes lower precedence than explicit campaign/tags */
  clientScope?: ClientScope
}

export interface GetDashboardSummaryParams {
  clientScope?: ClientScope
}

export interface CampaignsStatsOptions {
  from?: string
  to?: string
}

export interface CreateLinkPayload {
  target_url: string
  short_code?: string
  campaign?: string
  tags?: string[]
}

export interface UpdateLinkPayload {
  target_url?: string
  campaign?: string
  tags?: string[]
}

export interface ApiClient {
  getLinks(params: GetLinksParams): Promise<unknown>
  getDashboardSummary(params?: GetDashboardSummaryParams): Promise<unknown>
  getCampaignsStats(options?: CampaignsStatsOptions): Promise<unknown>
  createLink(payload: CreateLinkPayload): Promise<unknown>
  updateLink(id: string, payload: UpdateLinkPayload): Promise<unknown>
  deleteLink(id: string): Promise<unknown>
}

// ── Factory ───────────────────────────────────────────────────────────────────

export function createApiClient({
  token,
  baseUrl,
}: {
  token: string
  baseUrl: string
}): ApiClient {
  function headers(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'x-request-id': generateRequestId(),
    }
  }

  return {
    getLinks(params: GetLinksParams) {
      // Explicit filter-bar values take precedence over clientScope defaults
      const effectiveCampaign = params.campaign || params.clientScope?.campaign
      const url = buildUrl(baseUrl, 'links', {
        campaign: effectiveCampaign,
        tags: params.tags, // filter-bar comma-joined string kept as-is
        search: params.search,
        limit: params.limit,
        offset: params.offset,
      })
      // Append clientScope tags as repeated tags[] params
      appendArrayParam(url, 'tags', params.clientScope?.tags)
      return request(url.toString(), { method: 'GET', headers: headers() })
    },

    getDashboardSummary(params?: GetDashboardSummaryParams) {
      const url = buildUrl(baseUrl, 'dashboard/summary', {
        campaign: params?.clientScope?.campaign,
      })
      appendArrayParam(url, 'tags', params?.clientScope?.tags)
      return request(url.toString(), { method: 'GET', headers: headers() })
    },

    getCampaignsStats(options?: CampaignsStatsOptions) {
      const url = buildUrl(baseUrl, 'campaigns/stats', {
        from: options?.from,
        to: options?.to,
      })
      return request(url.toString(), { method: 'GET', headers: headers() })
    },

    createLink(payload: CreateLinkPayload) {
      const url = buildUrl(baseUrl, 'links')
      return request(url.toString(), {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(payload),
      })
    },

    updateLink(id: string, payload: UpdateLinkPayload) {
      const url = buildUrl(baseUrl, `links/${id}`)
      return request(url.toString(), {
        method: 'PATCH',
        headers: headers(),
        body: JSON.stringify(payload),
      })
    },

    deleteLink(id: string) {
      const url = buildUrl(baseUrl, `links/${id}`)
      return request(url.toString(), { method: 'DELETE', headers: headers() })
    },
  }
}
