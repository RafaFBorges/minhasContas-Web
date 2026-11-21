import type { NextRequest } from 'next/server'

import { FORBIDDEN_ORIGIN, json } from '@/server/http'
import { isSameOriginRequest } from '@/server/origin'
import { callApi, clearSession, readTokens } from '@/server/session'

export const dynamic = 'force-dynamic'

// Logout: encerra a sessão na API (apaga a cadeia do refresh token) e limpa os cookies. Os cookies saem mesmo que a API não responda:
// o navegador fica deslogado e o refresh token restante vence sozinho no prazo dele
export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request))
    return FORBIDDEN_ORIGIN()

  const { refresh } = readTokens(request)
  if (refresh) {
    const upstream = await callApi('logout', 'POST', JSON.stringify({ refreshToken: refresh }))
    if (upstream == null || upstream.status >= 500)
      console.error('logout : [Warning] API did not confirm the logout')
  }

  const response = json(204, null)
  clearSession(response)

  return response
}
