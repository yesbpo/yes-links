/**
 * ManagedView — Layer B verification surface
 *
 * Renders YesLinksDashboard with zero props.
 * The SDK reads token + baseUrl from the YesLinksProvider mounted in main.tsx.
 * This is the canonical "zero-config" integration pattern.
 */
import { YesLinksDashboard } from '@yes/links-ui'

export function ManagedView() {
  return (
    <div data-testid="managed-view" style={{ width: '100%' }}>
      <YesLinksDashboard />
    </div>
  )
}
