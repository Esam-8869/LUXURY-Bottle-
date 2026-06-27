import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-for-dev')

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const { pathname } = request.nextUrl

  // Protected paths
  const isAdminPath = pathname.startsWith('/admin')
  const isAccountPath = pathname.startsWith('/account') || pathname.startsWith('/checkout')

  if (isAdminPath || isAccountPath) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      
      if (isAdminPath && payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url))
      }
      
      return NextResponse.next()
    } catch (error) {
      // Token invalid or expired
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*', '/checkout/:path*'],
}
