import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useNotification } from './useNotification'

// Mock sonner since it's an external UI side-effect
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn()
  }
}))

import { toast } from 'sonner'

describe('useNotification (Resilience)', () => {
  it('should include actionable remediation in error notifications', () => {
    const { result } = renderHook(() => useNotification())

    act(() => {
      result.current.error({
        message: 'Network Timeout',
        remediation: 'Check your connection and try again',
        onRetry: () => console.log('Retrying...')
      })
    })

    // Verify toast.error was called with remediation AND retry action
    expect(toast.error).toHaveBeenCalledWith(
      expect.stringContaining('Network Timeout'),
      expect.objectContaining({
        description: 'Check your connection and try again',
        action: expect.objectContaining({
          label: 'Retry'
        })
      })
    )
  })
})
