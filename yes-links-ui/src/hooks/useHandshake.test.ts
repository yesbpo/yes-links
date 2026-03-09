import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useHandshake } from './useHandshake'

describe('useHandshake (Secure Iframe Communication)', () => {
  const mockOrigin = 'https://host-app.com'

  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_ALLOWED_ORIGIN', mockOrigin)
    vi.clearAllMocks()
  })

  it('should start in a loading state', () => {
    const { result } = renderHook(() => useHandshake())
    expect(result.current.isReady).toBe(false)
  })

  it('should become ready after receiving a valid INIT_SESSION message', () => {
    const { result } = renderHook(() => useHandshake())

    act(() => {
      const event = new MessageEvent('message', {
        origin: mockOrigin,
        data: {
          type: 'INIT_SESSION',
          payload: {
            token: 'valid-jwt',
            theme: { colors: { primary: '#ff0000' } }
          }
        }
      })
      window.dispatchEvent(event)
    })

    expect(result.current.isReady).toBe(true)
    expect(result.current.token).toBe('valid-jwt')
  })

  it('should ignore messages from unauthorized origins', () => {
    const { result } = renderHook(() => useHandshake())

    act(() => {
      const event = new MessageEvent('message', {
        origin: 'https://malicious-site.com',
        data: {
          type: 'INIT_SESSION',
          payload: { token: 'fake-token' }
        }
      })
      window.dispatchEvent(event)
    })

    expect(result.current.isReady).toBe(false)
    expect(result.current.token).toBeNull()
  })
})
