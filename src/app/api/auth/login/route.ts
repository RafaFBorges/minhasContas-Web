import type { NextRequest } from 'next/server'

import { FORBIDDEN_ORIGIN, UPSTREAM_DOWN, fromUpstream, json, readBody } from '@/server/http'
import { isSameOriginRequest } from '@/server/origin'
import { applySession, callApi, parseTokens, profileOf } from '@/server/session'

export const dynamic = 'force-dynamic'

// Login: a API devolve os tokens, que ficam só em cookies HttpOnly. O navegador recebe apenas os dados de exibição
export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request))
    return FORBIDDEN_ORIGIN()

  const body = await readBody(request)
  if (body === 'too-large')
    return json(413, { message: 'Payload too large' })

  let credentials: { user: string, password: string }
  try {
    const parsed = JSON.parse(body ?? '') as Record<string, unknown>
    if (typeof parsed.user !== 'string' || typeof parsed.password !== 'string')
      throw new Error('invalid')

    // Só estes dois campos seguem para a API
    credentials = { user: parsed.user, password: parsed.password }
  } catch {
    return json(400, { message: 'Invalid request' })
  }

  const upstream = await callApi('login', 'POST', JSON.stringify(credentials))
  if (upstream == null)
    return UPSTREAM_DOWN()

  if (upstream.status !== 200)
    return fromUpstream(upstream)

  const tokens = parseTokens(upstream.body)
  if (tokens == null) {
    console.error('login : [Error] unexpected response from the API')
    return UPSTREAM_DOWN()
  }

  const response = json(200, profileOf(tokens))
  applySession(response, tokens)

  return response
}
