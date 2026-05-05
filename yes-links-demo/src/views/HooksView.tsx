/**
 * HooksView — Layer C verification surface
 *
 * Uses useLinks and useStats directly to render a custom widget.
 * All data-testid attributes are required by e2e/integration.spec.ts.
 */
import { useLinks, useStats, type KPIStatsData } from '@yes/links-ui'

export function HooksView() {
  const { links, state: linksState, error: linksError } = useLinks({ limit: 5 })
  const { kpiData, state: statsState } = useStats()

  return (
    <div style={{ padding: '1rem', fontFamily: 'monospace' }}>
      {/* ── Links Panel ─────────────────────────────────────────────── */}
      <section
        data-testid="hooks-links-panel"
        style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}
      >
        <h2 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          useLinks hook
        </h2>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
          <span>
            state: <strong data-testid="links-state">{linksState}</strong>
          </span>
          <span>
            count: <strong data-testid="links-count">{links.length}</strong>
          </span>
        </div>

        {linksError && (
          <div
            data-testid="hooks-error"
            style={{ color: 'red', fontSize: '0.875rem', padding: '0.5rem', background: '#fee', borderRadius: '4px' }}
          >
            Error: {linksError.message}
          </div>
        )}

        {linksState === 'error' && !linksError && (
          <div
            data-testid="hooks-error"
            style={{ color: 'red', fontSize: '0.875rem', padding: '0.5rem', background: '#fee', borderRadius: '4px' }}
          >
            Error loading links
          </div>
        )}

        <ul style={{ listStyle: 'none', padding: 0, margin: '0.5rem 0 0' }}>
          {links.map((link, index) => (
            <li
              key={link.id}
              data-testid={`link-item-${index}`}
              style={{ padding: '0.25rem 0', borderBottom: '1px solid #eee', fontSize: '0.875rem' }}
            >
              <strong>{link.short_code}</strong> → {link.target_url}
            </li>
          ))}
        </ul>
      </section>

      {/* ── Stats Panel ─────────────────────────────────────────────── */}
      <section
        data-testid="hooks-stats-panel"
        style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}
      >
        <h2 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          useStats hook
        </h2>

        <div style={{ marginBottom: '0.5rem' }}>
          state: <strong data-testid="stats-state">{statsState}</strong>
        </div>

        {kpiData && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem' }}>
            <div>
              total_links: <strong data-testid="stats-total-links">{kpiData.total_links}</strong>
            </div>
            <div>
              total_clicks: <strong data-testid="stats-total-clicks">{kpiData.total_clicks}</strong>
            </div>
          </div>
        )}

        {statsState !== 'loading' && !kpiData && (
          <div style={{ color: '#666', fontSize: '0.875rem' }}>No stats available</div>
        )}
      </section>
    </div>
  )
}
