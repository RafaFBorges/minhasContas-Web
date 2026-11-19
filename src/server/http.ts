import { NextResponse } from 'next/server'
import type { UpstreamResponse } from './session'

// Respostas do /api nunca são guardadas em cache (levam dados e cookies de um usuário só)
export function json(status: number, body: unknown, headers: Record<string, string> = {}): NextResponse {
  return new NextResponse(status === 204 ? null : JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers },
  })
}

// Repassa a resposta da API: status, corpo, tipo e Retry-After (do 429). Nenhum outro cabeçalho dela passa
export function fromUpstream(upstream: UpstreamResponse): NextResponse {
  const headers: Record<string, string> = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }
  if (upstream.contentType)
    headers['Content-Type'] = upstream.contentType
  if (upstream.retryAfter)
    headers['Retry-After'] = upstream.retryAfter

  const noBody = upstream.status === 204 || upstream.status === 304
  return new NextResponse(noBody ? null : upstream.body, { status: upstream.status, headers })
}

export const FORBIDDEN_ORIGIN = () => json(403, { message: 'Forbidden' })
export const UPSTREAM_DOWN = () => json(502, { message: 'Service unavailable' })

export const MAX_BODY_BYTES = 1_000_000

export async function readBody(request: Request): Promise<string | undefined | 'too-large'> {
  if (request.method === 'GET' || request.method === 'HEAD')
    return undefined

  const declared = Number(request.headers.get('content-length') ?? 0)
  if (declared > MAX_BODY_BYTES)
    return 'too-large'

  if (request.body == null)
    return ''

  // Lê aos poucos e para no limite: com Transfer-Encoding: chunked não há Content-Length para conferir antes
  const reader = request.body.getReader()
  const decoder = new TextDecoder()
  let text = ''
  let bytes = 0

  for (;;) {
    const { done, value } = await reader.read()
    if (done)
      break

    bytes += value.byteLength
    if (bytes > MAX_BODY_BYTES) {
      await reader.cancel().catch(() => undefined)
      return 'too-large'
    }

    text += decoder.decode(value, { stream: true })
  }

  return text + decoder.decode()
}
