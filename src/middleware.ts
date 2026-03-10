import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { LOGIN_COOKIE_KEY } from '../utils/DataConstants'

export default function middleware(request: NextRequest) {
  const token = request.cookies.get(LOGIN_COOKIE_KEY)?.value
  const isPrivatePage = request.nextUrl.pathname.startsWith('/home')

  if (token)
    console.log('middleware > token=' + token + ' time=' + new Date(token.split("_")[1]) + ' valid=' + (new Date() < (new Date(token.split("_")[1]))))

  if (isPrivatePage) {
    const validToken = token ? new Date() < new Date(token.split("_")[1]) : false

    if (!validToken)
      return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/home/:path*']
}