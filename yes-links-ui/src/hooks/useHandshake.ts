import { useState, useEffect } from 'react'
import { logger } from '@/lib/logger'
import { injectTheme } from '@/theme/themeInjector'

export const useHandshake = () => {
  const [isReady, setIsReady] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  const allowedOrigin = process.env.NEXT_PUBLIC_ALLOWED_ORIGIN

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security Check: Verify Origin
      if (allowedOrigin && event.origin !== allowedOrigin) {
        logger.warn({
          event: 'ui.handshake.origin_rejected.v1',
          origin: event.origin
        }, 'Received message from unauthorized origin')
        return
      }

      const { type, payload } = event.data

      if (type === 'INIT_SESSION') {
        setToken(payload.token)
        if (payload.theme) {
          injectTheme(payload.theme)
        }
        setIsReady(true)
        
        logger.info({
          event: 'ui.handshake.success.v1',
          origin: event.origin
        }, 'UI initialized successfully via handshake')
      }

      if (type === 'THEME_UPDATE') {
        if (payload.theme) {
          injectTheme(payload.theme)
          logger.info({
            event: 'ui.theme.updated.v1',
            origin: event.origin
          }, 'UI theme updated at runtime')
        }
      }
    }

    window.addEventListener('message', handleMessage)
    
    // Notify host that UI is ready for handshake
    window.parent.postMessage({ type: 'UI_READY', payload: { version: '1.0.0' } }, '*')

    return () => window.removeEventListener('message', handleMessage)
  }, [allowedOrigin])

  return { isReady, token }
}
