import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock postMessage for handshake tests
window.postMessage = vi.fn()
