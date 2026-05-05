/**
 * Tests for CreateLinkOverlay — mode + lockedScope props
 * RED phase for clientScope + mode feature
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { CreateLinkOverlay } from './CreateLinkOverlay'

function renderOverlay(props: Partial<React.ComponentProps<typeof CreateLinkOverlay>> = {}) {
  return render(
    <CreateLinkOverlay
      isOpen={true}
      onClose={vi.fn()}
      {...props}
    />
  )
}

// ── mode=internal (default) ───────────────────────────────────────────────────

describe('CreateLinkOverlay — mode=internal (default)', () => {
  it('renders the campaign field', () => {
    renderOverlay()
    expect(document.getElementById('overlay-campaign')).not.toBeNull()
  })

  it('renders the tags field', () => {
    renderOverlay()
    expect(document.getElementById('overlay-tags')).not.toBeNull()
  })

  it('campaign field is editable', () => {
    renderOverlay()
    const field = document.getElementById('overlay-campaign') as HTMLInputElement
    fireEvent.change(field, { target: { value: 'my-campaign' } })
    expect(field.value).toBe('my-campaign')
  })

  it('submits campaign value entered by the user', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    renderOverlay({ onSubmit })
    const field = document.getElementById('overlay-campaign') as HTMLInputElement
    fireEvent.change(field, { target: { value: 'user-campaign' } })
    fireEvent.submit(document.querySelector('form')!)
    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    expect(onSubmit.mock.calls[0][0]).toMatchObject({ campaign: 'user-campaign' })
  })
})

// ── mode=external ─────────────────────────────────────────────────────────────

describe('CreateLinkOverlay — mode=external', () => {
  it('hides the campaign field', () => {
    renderOverlay({ mode: 'external', lockedCampaign: 'summer', lockedTags: [] })
    expect(document.getElementById('overlay-campaign')).toBeNull()
  })

  it('hides the tags field', () => {
    renderOverlay({ mode: 'external', lockedCampaign: 'summer', lockedTags: ['promo'] })
    expect(document.getElementById('overlay-tags')).toBeNull()
  })

  it('submits lockedCampaign in the payload even without a visible input', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    renderOverlay({
      mode: 'external',
      lockedCampaign: 'locked-campaign',
      lockedTags: [],
      onSubmit,
    })
    fireEvent.submit(document.querySelector('form')!)
    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    expect(onSubmit.mock.calls[0][0]).toMatchObject({ campaign: 'locked-campaign' })
  })

  it('submits lockedTags in the payload even without a visible textarea', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    renderOverlay({
      mode: 'external',
      lockedCampaign: 'camp',
      lockedTags: ['portal', 'client-x'],
      onSubmit,
    })
    fireEvent.submit(document.querySelector('form')!)
    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    expect(onSubmit.mock.calls[0][0].tags).toEqual(['portal', 'client-x'])
  })

  it('submits empty tags array when lockedTags is empty', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    renderOverlay({ mode: 'external', lockedCampaign: 'camp', lockedTags: [], onSubmit })
    fireEvent.submit(document.querySelector('form')!)
    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    expect(onSubmit.mock.calls[0][0].tags).toEqual([])
  })
})
