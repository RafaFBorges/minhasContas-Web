export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogEntry {
  date: string
  line: string
}

export type WorkerRequest =
  | { type: 'append'; id: number; date: string; text: string }
  | { type: 'cleanup'; id: number; keepDays: number }

export interface WorkerResponse {
  id: number
  error?: string
}

export const LOG_LEVEL_ORDER: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 }

export const LOG_FILE_REGEX = /^(\d{4}-\d{2}-\d{2})\.log$/

// Data local no formato AAAA-MM-DD. Usada como nome do arquivo diário
export function formatLogDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${date.getFullYear()}-${month}-${day}`
}

export function logFileName(date: string) {
  return `${date}.log`
}

// Agrupa em trechos consecutivos de mesma data, preservando a ordem.
// Uma entrada criada antes da meia-noite continua indo para o arquivo do seu dia
export function groupEntriesByDate(entries: LogEntry[]) {
  const groups: { date: string; text: string }[] = []

  for (const entry of entries) {
    const last = groups[groups.length - 1]
    if (last && last.date === entry.date)
      last.text += entry.line + '\n'
    else
      groups.push({ date: entry.date, text: entry.line + '\n' })
  }

  return groups
}

// Arquivos com data anterior a esta devem ser apagados.
// keepDays conta o dia de hoje: 30 mantém hoje + 29 dias anteriores
export function getRetentionLimitDate(keepDays: number, now = new Date()) {
  const limit = new Date(now)
  limit.setDate(limit.getDate() - (keepDays - 1))

  return formatLogDate(limit)
}
