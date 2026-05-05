# Yes Links UI SDK Public Surface

## Purpose

This document defines the canonical public component surface for `yes-links-ui`.

The rule is simple:

- `Pages/*` stories must be composed only from canonical public SDK components.
- Any component used to build the polished product pages must be either:
  - exported from `src/index.ts`, or
  - explicitly treated as internal/legacy and excluded from the canonical page path.

## Public SDK Components

### Layout

- `YesLinksProvider`
- `useYesLinks`
- `YesLinksShell`

### Links

- `LinkCard`
- `LinkList`
- `FilterBar`
- `CreateLinkOverlay`

### Analytics

- `KPIStats`
- `PerformanceTrends`

### Page Components

- `YesLinksDashboard`
- `ActiveLinksPage`
- `GlobalStatsPage`

### Hooks and Theme

- `useNotification`
- `injectTheme`

## Internal Or Legacy Components

These components are not part of the canonical SDK page-building surface:

- `CreateLinkForm`
- `ClicksChart`
- `BulkUpload`
- old dashboard composition stories

They may remain temporarily for migration, but they must not be the source of truth for `Pages/*`.

## Storybook Taxonomy

The canonical Storybook taxonomy is:

- `SDK/Layout/*`
- `SDK/Links/*`
- `SDK/Analytics/*`
- `Pages/*`
- `Legacy/*`

## Enforcement

The following contracts must hold:

1. `src/index.ts` exports the canonical public SDK components.
2. Canonical SDK components have dedicated stories.
3. `Pages/*` stories import only canonical public SDK components.
4. Playwright smoke coverage validates the rendered `Pages/*` parity.
5. `YesLinksDashboard` is the preferred full-page SDK entry for org-wide integrations.
