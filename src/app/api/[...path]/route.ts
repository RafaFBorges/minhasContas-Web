import type { NextRequest } from 'next/server'

import { FORBIDDEN_ORIGIN, UPSTREAM_DOWN, fromUpstream, json, readBody } from '@/server/http'
import { isSameOriginRequest } from '@/server/origin'
import { applySession, clearSession, callApi, readTokens, refreshSession, type ApiTokens } from '@/server/session'

export const dynamic = 'force-dynamic'

// Proxy para a API. É uma lista fechada: só estes caminhos e métodos passam, e nunca /login, /refresh ou /logout
// (esses têm rotas próprias em /api/auth, que cuidam dos cookies).
const PROTECTED_ROOTS = new Set(['expense', 'category'])
const PUBLIC_ROOTS = new Set(['register'])
const METHODS = new Set(['GET', 'POST', 'PUT', 'DELETE'])
const SEGMENT = /^[A-Za-z0-9_-]{1,64}$/

function targetOf(segments: string[]): { path: string, isPublic: boolean } | null {
  if (segments.length === 0 || 8 < segments.length || !segments.every(s => SEGMENT.test(s)))
    return null

  const root = segments[0]
  if (!PROTECTED_ROOTS.has(root) && !PUBLIC_ROOTS.has(root))
    return null

  return { path: segments.join('/'), isPublic: PUBLIC_ROOTS.has(root) }
}

async function handle(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  if (!METHODS.has(request.method))
    return json(405, { message: 'Method Not Allowed' }, { Allow: [...METHODS].join(', ') })

  if (!isSameOriginRequest(request))
    return FORBIDDEN_ORIGIN()

  const target = targetOf((await context.params).path ?? [])
  if (target == null)
    return json(404, { message: 'Not Found' })

  const body = await readBody(request)
  if (body === 'too-large')
    return json(413, { message: 'Payload too large' })

  // Rotas públicas (cadastro) não levam token
  if (target.isPublic) {
    const upstream = await callApi(target.path, request.method, body)

    return upstream == null ? UPSTREAM_DOWN() : fromUpstream(upstream)
  }

  const { access, refresh } = readTokens(request)
  const state: { accessToken: string | undefined, renewed: ApiTokens | null } = { accessToken: access, renewed: null }

  const renew = async (): Promise<'ok' | 'denied' | 'unavailable'> => {
    if (!refresh)
      return 'denied'

    const result = await refreshSession(refresh)
    if (result.kind === 'ok') {
      state.renewed = result.tokens
      state.accessToken = result.tokens.accessToken
    }

    return result.kind
  }

  const sessionEnded = () => {
    const response = json(401, { message: 'Session expired' })
    clearSession(response)

    return response
  }

  // Access token ausente (venceu e o cookie saiu): renova antes de chamar
  if (!state.accessToken) {
    const outcome = await renew()
    if (outcome === 'denied')
      return sessionEnded()
    if (outcome === 'unavailable')
      return UPSTREAM_DOWN()
  }

  let upstream = await callApi(target.path, request.method, body, state.accessToken)

  // Recusado: o token pode ter vencido no meio do caminho. Uma renovação e uma nova tentativa (a primeira não teve efeito algum)
  if (upstream != null && upstream.status === 401 && state.renewed == null) {
    const outcome = await renew()
    if (outcome === 'denied')
      return sessionEnded()
    if (outcome === 'unavailable')
      return UPSTREAM_DOWN()

    upstream = await callApi(target.path, request.method, body, state.accessToken)
  }

  if (upstream == null)
    return UPSTREAM_DOWN()

  const response = fromUpstream(upstream)
  if (state.renewed != null)
    applySession(response, state.renewed)

  // Mesmo depois de renovar a API recusou: a conta não tem mais acesso. Não deixa a sessão pendurada
  if (upstream.status === 401)
    clearSession(response)

  return response
}

export { handle as GET, handle as POST, handle as PUT, handle as DELETE }
