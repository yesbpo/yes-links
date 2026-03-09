import { describe, it, expect, beforeEach } from 'vitest'
import { createLogger } from './logger'
import { Writable } from 'stream'

describe('Logger (Observability Rule 3)', () => {
  let logOutput: any[] = []
  let testLogger: any

  beforeEach(() => {
    logOutput = []
    const stream = new Writable({
      write(chunk, encoding, callback) {
        logOutput.push(JSON.parse(chunk.toString()))
        callback()
      }
    })
    testLogger = createLogger(stream)
  })

  it('should emit structured JSON logs with mandatory fields', () => {
    testLogger.info({
      event: 'ui.test_event.v1',
      request_id: 'test-req-123',
      route: '/dashboard',
      status_code: 200,
      duration: 150
    }, 'Test log message')

    const lastLog = logOutput[0]

    expect(lastLog).toMatchObject({
      level: 'info',
      service: 'yes-links-ui',
      event: 'ui.test_event.v1',
      request_id: 'test-req-123',
      route: '/dashboard',
      status_code: 200,
      duration: 150,
      msg: 'Test log message'
    })
    
    expect(lastLog.timestamp).toBeDefined()
  })
})
