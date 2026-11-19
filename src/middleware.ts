import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { USER_COOKIE_KEY } from '../utils/DataConstants'

// Só barra quem claramente não tem sessão (sem o cookie de exibição, ou vencido). Quem decide se o token vale é a API,
// a cada chamada feita pelo /api; este cookie sozinho não dá acesso a dado nenhum
function hasSession(request: NextRequest): boolean {
  const saved = request.cookies.get(USER_COOKIE_KEY)?.value
  if (!saved)
    return false

  try {
    const profile = JSON.parse(saved) as { id?: unknown, sessionExpiresAt?: unknown }

    return typeof profile.id === 'number' && typeof profile.sessionExpiresAt === 'string' &&
      Date.now() < Date.parse(profile.sessionExpiresAt)
  } catch {
    // Cookie corrompido ou de uma versão antiga: sem sessão (antes isto derrubava o middleware com erro 500)
    return false
  }
}

export default function middleware(request: NextRequest) {
  const isPrivatePage = request.nextUrl.pathname.startsWith('/home')

  if (isPrivatePage && !hasSession(request)) {
    console.log('middleware > Redirect to /')
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/home/:path*']
}
