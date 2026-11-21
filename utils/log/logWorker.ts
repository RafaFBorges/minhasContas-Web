import { LOG_DIR, LOG_MAX_FILE_BYTES } from '../DataConstants'
import { LOG_FILE_REGEX, WorkerRequest, WorkerResponse, getRetentionLimitDate, logFileName } from './logShared'

// Roda dentro de um Web Worker: é o único lugar que escreve no OPFS.
// createSyncAccessHandle só existe em worker e permite append sem reescrever o arquivo.

// O lib.dom do TypeScript ainda não declara estes tipos
interface IterableDirectory {
  entries(): AsyncIterable<[string, FileSystemHandle]>
}

interface SyncAccessHandle {
  getSize(): number
  write(buffer: BufferSource, options?: { at: number }): number
  flush(): void
  close(): void
}

interface SyncFileHandle {
  createSyncAccessHandle(): Promise<SyncAccessHandle>
}

const encoder = new TextEncoder()

// Serializa o processamento: cada pedido só começa quando o anterior terminou
let chain: Promise<void> = Promise.resolve()

function lockName(date: string) {
  return `log-file-${date}`
}

async function getLogDir() {
  const root = await navigator.storage.getDirectory()

  return root.getDirectoryHandle(LOG_DIR, { create: true })
}

function limitReachedLine() {
  return JSON.stringify({
    time: new Date().toISOString(),
    level: 'warn',
    event: 'log.fileLimitReached',
    data: { maxBytes: LOG_MAX_FILE_BYTES },
  }) + '\n'
}

// Abre, escreve e fecha a cada lote. O Web Lock impede que duas abas
// disputem o mesmo arquivo e deixa o arquivo livre para leitura entre os lotes
async function append(date: string, text: string) {
  const dir = await getLogDir()

  await navigator.locks.request(lockName(date), async () => {
    const file = await dir.getFileHandle(logFileName(date), { create: true })
    const access = await (file as unknown as SyncFileHandle).createSyncAccessHandle()

    try {
      const size = access.getSize()
      // Teto por arquivo: depois dele, descarta em silêncio até virar o dia
      if (size >= LOG_MAX_FILE_BYTES)
        return

      const data = encoder.encode(text)
      access.write(data, { at: size })
      if (size + data.length >= LOG_MAX_FILE_BYTES)
        access.write(encoder.encode(limitReachedLine()), { at: size + data.length })
      access.flush()
    } finally {
      access.close()
    }
  })
}

async function cleanup(keepDays: number) {
  const dir = await getLogDir()
  const limitDate = getRetentionLimitDate(keepDays)

  const names: string[] = []
  for await (const [name] of (dir as unknown as IterableDirectory).entries())
    names.push(name)

  for (const name of names) {
    const match = LOG_FILE_REGEX.exec(name)
    if (match && match[1] < limitDate)
      await navigator.locks.request(lockName(match[1]), () => dir.removeEntry(name))
  }
}

async function process(request: WorkerRequest) {
  if (request.type === 'append')
    await append(request.date, request.text)
  else
    await cleanup(request.keepDays)
}

function reply(response: WorkerResponse) {
  self.postMessage(response)
}

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const request = event.data

  chain = chain
    .then(() => process(request))
    .then(
      () => reply({ id: request.id }),
      (error) => reply({ id: request.id, error: String(error) })
    )
}
