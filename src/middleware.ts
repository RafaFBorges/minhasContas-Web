import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { USER_COOKIE_KEY } from '../utils/DataConstants'
import { User } from './domain/User'

export default function middleware(request: NextRequest) {
  const isPrivatePage = request.nextUrl.pathname.startsWith('/home')

  if (isPrivatePage) {
    const savedCookie = request.cookies.get(USER_COOKIE_KEY)?.value
    const user = savedCookie != null ? User.fromIUser(JSON.parse(decodeURIComponent(savedCookie))) : null
    const validToken = user != null ? user.isValidToken : false

    if (!validToken) {
      console.log('middleware > Redirect to /')
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/home/:path*']
}
