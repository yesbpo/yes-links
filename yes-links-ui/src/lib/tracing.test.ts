import { describe, it, expect, vi, beforeEach } from 'vitest'
import { withTrace } from './tracing'
import { trace, SpanStatusCode } from '@opentelemetry/api'

// Mock OTel API
vi.mock('@opentelemetry/api', async () => {
  const actual = await vi.importActual('@opentelemetry/api') as any
  const span = {
    setAttribute: vi.fn(),
    setStatus: vi.fn(),
    end: vi.fn(),
    isRecording: () => true
  }
  const tracer = {
    startActiveSpan: vi.fn((name, options, context, fn) => {
      if (typeof options === 'function') return options(span)
      return fn(span)
    })
  }
  return {
    ...actual,
    trace: {
      getTracer: () => tracer
    },
    SpanStatusCode: actual.SpanStatusCode
  }
})

describe('Tracing (Observability Rule 3)', () => {
  it('should wrap an operation in a trace span with attributes', async () => {
    const mockOperation = vi.fn().mockResolvedValue('success')
    
    const result = await withTrace('test.operation.v1', {
      'custom.attr': 'value'
    }, mockOperation)

    expect(result).toBe('success')
    
    const tracer = trace.getTracer('yes-links-ui')
    expect(tracer.startActiveSpan).toHaveBeenCalledWith(
      'test.operation.v1',
      expect.any(Function)
    )
  })
})
