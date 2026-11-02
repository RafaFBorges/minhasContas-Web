import { logManager } from './logManager'
import { LOG_MIN_LEVEL } from '../DataConstants'
import { LOG_LEVEL_ORDER, LogLevel, formatLogDate } from './logShared'

function serialize(time: Date, level: LogLevel, event: string, data?: unknown) {
  const replacer = (_key: string, value: unknown) =>
    value instanceof Error ? { name: value.name, message: value.message, stack: value.stack } : value

  try {
    return JSON.stringify({ time: time.toISOString(), level, event, data }, replacer)
  } catch {
    return JSON.stringify({ time: time.toISOString(), level, event, data: '[não serializável]' })
  }
}

function write(level: LogLevel, event: string, data?: unknown) {
  if (LOG_LEVEL_ORDER[level] < LOG_LEVEL_ORDER[LOG_MIN_LEVEL])
    return

  const now = new Date()

  logManager.enqueue({ date: formatLogDate(now), line: serialize(now, level, event, data) })
}

// Ponto único de log da aplicação. Cada chamada é assíncrona e não bloqueia a UI
export const logger = {
  debug: (event: string, data?: unknown) => write('debug', event, data),
  info: (event: string, data?: unknown) => write('info', event, data),
  warn: (event: string, data?: unknown) => write('warn', event, data),
  error: (event: string, data?: unknown) => write('error', event, data),
}
