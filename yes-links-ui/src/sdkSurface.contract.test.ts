import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import * as sdk from './index'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const expectedExports = [
  'YesLinksProvider',
  'useYesLinks',
  'YesLinksShell',
  'YesLinksDashboard',
  'LinkCard',
  'LinkList',
  'FilterBar',
  'KPIStats',
  'PerformanceTrends',
  'CreateLinkOverlay',
  'ActiveLinksPage',
  'GlobalStatsPage',
  'useNotification',
  'injectTheme',
] as const

const expectedStoryFiles = [
  'src/components/YesLinksShell.stories.tsx',
  'src/components/YesLinksDashboard.stories.tsx',
  'src/components/LinkCard.stories.tsx',
  'src/components/LinkList.stories.tsx',
  'src/components/FilterBar.stories.tsx',
  'src/components/KPIStats.stories.tsx',
  'src/components/PerformanceTrends.stories.tsx',
  'src/components/CreateLinkOverlay.stories.tsx',
  'src/stories/ActiveLinksPage.stories.tsx',
  'src/stories/GlobalStatsPage.stories.tsx',
] as const

describe('SDK public surface contract', () => {
  it('exports the canonical SDK components used by the polished pages', () => {
    expectedExports.forEach((exportName) => {
      expect(sdk[exportName]).toBeDefined()
    })
  })

  it('does not expose the old CreateLinkForm as the canonical page-building API', () => {
    expect('CreateLinkForm' in sdk).toBe(false)
  })
})

describe('Storybook contract', () => {
  it('contains stories for every canonical SDK component and page', () => {
    expectedStoryFiles.forEach((relativeFile) => {
      const fullPath = path.join(projectRoot, relativeFile)
      expect(fs.existsSync(fullPath), `${relativeFile} should exist`).toBe(true)
    })
  })

  it('keeps page stories restricted to canonical page components', () => {
    const activeLinksStory = fs.readFileSync(
      path.join(projectRoot, 'src/stories/ActiveLinksPage.stories.tsx'),
      'utf8',
    )
    const globalStatsStory = fs.readFileSync(
      path.join(projectRoot, 'src/stories/GlobalStatsPage.stories.tsx'),
      'utf8',
    )

    expect(activeLinksStory).toContain("@/components/ActiveLinksPage")
    expect(globalStatsStory).toContain("@/components/GlobalStatsPage")
  })
})
