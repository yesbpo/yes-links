/**
 * App — tab router between demo views.
 *
 * Both views share the same YesLinksProvider (mounted in main.tsx).
 * This validates that useLinks, useStats, and YesLinksDashboard can
 * coexist under one provider without hook conflicts.
 */
import { useState } from 'react'
import { ManagedView } from './views/ManagedView'
import { HooksView } from './views/HooksView'

type Tab = 'managed' | 'hooks'

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>('managed')

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
      {/* ── Tab bar ───────────────────────────────────────────────────── */}
      <nav
        data-testid="tab-bar"
        style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}
      >
        <button
          data-testid="tab-managed"
          onClick={() => setActiveTab('managed')}
          style={{
            padding: '0.5rem 1rem',
            fontWeight: activeTab === 'managed' ? 'bold' : 'normal',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'managed' ? '2px solid #333' : 'none',
          }}
        >
          Managed Dashboard
        </button>
        <button
          data-testid="tab-hooks"
          onClick={() => setActiveTab('hooks')}
          style={{
            padding: '0.5rem 1rem',
            fontWeight: activeTab === 'hooks' ? 'bold' : 'normal',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'hooks' ? '2px solid #333' : 'none',
          }}
        >
          Hooks API
        </button>
      </nav>

      {/* ── Active view ───────────────────────────────────────────────── */}
      {activeTab === 'managed' && <ManagedView />}
      {activeTab === 'hooks' && <HooksView />}
    </div>
  )
}
