const readProcessEnv = (key: string) => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key]
  }

  return undefined
}

const readImportMetaEnv = (key: string) => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key]
  }

  return undefined
}

export const readEnv = (key: string, fallback?: string) => {
  const value = readImportMetaEnv(key) ?? readProcessEnv(key)

  if (value === undefined || value === null || value === '') {
    return fallback
  }

  return String(value)
}
