import { LOG_FLUSH_INTERVAL_MS, LOG_MAX_BATCH, LOG_MAX_PENDING, LOG_RETENTION_DAYS } from '../DataConstants'
import { LogEntry, WorkerRequest, WorkerResponse, formatLogDate, groupEntriesByDate } from './logShared'

// Organiza a escrita dos logs: recebe pedidos assíncronos, mantém uma fila
// ordenada em memória e descarrega em lote para o worker que grava no OPFS.
class LogManager {
  private worker: Worker | null = null
  private queue: LogEntry[] = []
  private timer: ReturnType<typeof setTimeout> | null = null
  private pending = new Map<number, () => void>()
  private nextId = 0
  private disabled = false
  private dropped = 0

  private isSupported() {
    return typeof window !== 'undefined'
      && typeof Worker !== 'undefined'
      && typeof navigator.storage?.getDirectory === 'function'
      && typeof navigator.locks?.request === 'function'
  }

  private getWorker() {
    if (this.worker)
      return this.worker
    if (this.disabled || !this.isSupported())
      return null

    const worker = new Worker(new URL('./logWorker.ts', import.meta.url), { type: 'module' })

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const { id, error } = event.data

      if (error)
        console.error('LogManager > falha ao gravar log: ' + error)

      this.pending.get(id)?.()
      this.pending.delete(id)
    }
    worker.onerror = (event) => {
      console.error('LogManager > worker de log falhou, logs desativados: ' + event.message)
      this.disable()
    }

    this.worker = worker
    this.start(worker)

    return worker
  }

  private start(worker: Worker) {
    // Pede ao navegador para não apagar os logs sob pressão de disco
    navigator.storage.persist?.().catch(() => undefined)

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden')
        void this.flush()
    })
    // Melhor esforço: o flush só envia a mensagem ao worker, e ao descarregar a página
    // o worker pode ser encerrado antes de gravar. O visibilitychange acima cobre a maioria dos casos
    window.addEventListener('pagehide', () => void this.flush())

    void this.send(worker, (id) => ({ type: 'cleanup', id, keepDays: LOG_RETENTION_DAYS }))
  }

  private disable() {
    this.disabled = true
    this.worker?.terminate()
    this.worker = null
    this.queue = []
    this.pending.forEach((resolve) => resolve())
    this.pending.clear()
  }

  private send(worker: Worker, build: (id: number) => WorkerRequest) {
    return new Promise<void>((resolve) => {
      const id = this.nextId++

      this.pending.set(id, resolve)
      worker.postMessage(build(id))
    })
  }

  // Não bloqueia quem chamou: só entra na fila e agenda a gravação
  enqueue(entry: LogEntry) {
    if (this.disabled || !this.isSupported())
      return

    this.queue.push(entry)

    if (this.queue.length >= LOG_MAX_BATCH)
      void this.flush()
    else if (!this.timer)
      this.timer = setTimeout(() => void this.flush(), LOG_FLUSH_INTERVAL_MS)
  }

  // Resolve quando o worker confirmar a gravação do que estava na fila
  async flush() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }

    const worker = this.getWorker()
    if (!worker || this.queue.length === 0)
      return

    const entries = this.queue.splice(0)

    // Worker travado: não deixa a memória crescer sem limite, descarta e conta
    if (this.pending.size >= LOG_MAX_PENDING) {
      this.dropped += entries.length
      return
    }

    if (this.dropped > 0) {
      const now = new Date()
      entries.unshift({
        date: formatLogDate(now),
        line: JSON.stringify({ time: now.toISOString(), level: 'warn', event: 'log.dropped', data: { count: this.dropped } }),
      })
      this.dropped = 0
    }

    const groups = groupEntriesByDate(entries)

    await Promise.all(groups.map((group) =>
      this.send(worker, (id) => ({ type: 'append', id, date: group.date, text: group.text }))
    ))
  }
}

export const logManager = new LogManager()
