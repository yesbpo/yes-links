import pino from 'pino'

export const createLogger = (destination?: pino.DestinationStream) => {
  const pinoLogger = pino({
    level: process.env.LOG_LEVEL || 'info',
    formatters: {
      level: (label) => {
        return { level: label }
      },
    },
    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
    base: {
      service: process.env.SERVICE_NAME || 'yes-links-ui',
    },
  }, destination)

  return {
    info: (ctx: Record<string, any>, msg: string) => {
      pinoLogger.info(ctx, msg)
    },
    error: (ctx: Record<string, any>, msg: string) => {
      pinoLogger.error(ctx, msg)
    },
    warn: (ctx: Record<string, any>, msg: string) => {
      pinoLogger.warn(ctx, msg)
    },
    debug: (ctx: Record<string, any>, msg: string) => {
      pinoLogger.debug(ctx, msg)
    }
  }
}

export const logger = createLogger()
