import { trace, SpanStatusCode, Span, Tracer } from '@opentelemetry/api'

const serviceName = process.env.SERVICE_NAME || 'yes-links-ui'

let tracerInstance: Tracer | null = null

export const getTracer = () => {
  if (!tracerInstance) {
    tracerInstance = trace.getTracer(serviceName)
  }
  return tracerInstance
}

export const withTrace = async <T>(
  name: string,
  attributes: Record<string, string | number | boolean>,
  fn: (span: Span) => Promise<T>
): Promise<T> => {
  const tracer = getTracer()

  return tracer.startActiveSpan(name, async (span) => {
    try {
      // Set initial attributes
      Object.entries(attributes).forEach(([key, value]) => {
        span.setAttribute(key, value)
      })

      const result = await fn(span)
      
      span.setStatus({ code: SpanStatusCode.OK })
      return result
    } catch (error: any) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message
      })
      span.recordException(error)
      throw error
    } finally {
      span.end()
    }
  })
}
