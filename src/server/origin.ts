import type { NextRequest } from 'next/server'

// Defesa contra CSRF nas rotas /api: os cookies de sessão são SameSite=Lax, e além disso toda requisição que altera algo
// (qualquer método que não seja GET/HEAD) precisa vir do próprio site. Os navegadores sempre mandam Origin nesses métodos;
// sem ele (ou com outro site), a requisição é recusada. Quem não é navegador não tem os cookies, então não precisa passar por aqui.
const SAFE_METHODS = new Set(['GET', 'HEAD'])

export function isSameOriginRequest(request: NextRequest): boolean {
  if (SAFE_METHODS.has(request.method))
    return true

  // Quando o navegador informa, qualquer coisa diferente de same-origin é recusada
  const fetchSite = request.headers.get('sec-fetch-site')
  if (fetchSite != null && fetchSite !== 'same-origin')
    return false

  const origin = request.headers.get('origin')
  if (!origin)
    return false

  let originHost: string
  try {
    originHost = new URL(origin).host
  } catch {
    return false
  }

  const hosts = [
    request.headers.get('host'),
    request.headers.get('x-forwarded-host')?.split(',')[0]?.trim(),
    request.nextUrl.host,
  ]

  return hosts.some(host => host != null && host !== '' && host === originHost)
}
