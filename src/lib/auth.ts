import { SignJWT, jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-jwt-key-256-bit-random-string-for-dev')
const COOKIE_NAME = 'lb_auth_token'

export interface JWTPayload {
  userId: string
  email: string
  role: 'CUSTOMER' | 'ADMIN'
}

// Sign a new JWT
export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN || '1d')
    .sign(JWT_SECRET)
}

// Verify a JWT (throws if invalid)
export async function verifyToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, JWT_SECRET)
  return payload as unknown as JWTPayload
}

// Set auth cookie on a NextResponse
export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  })
}

// Clear auth cookie
export function clearAuthCookie(response: NextResponse): void {
  response.cookies.delete(COOKIE_NAME)
}

// Get current user from request (returns null if not authenticated)
export async function getCurrentUser(request: NextRequest): Promise<JWTPayload | null> {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value
    if (!token) return null
    return await verifyToken(token)
  } catch {
    return null
  }
}

// Middleware helper: require authentication
export async function requireAuth(
  request: NextRequest
): Promise<{ user: JWTPayload } | NextResponse> {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized', code: 'AUTH_REQUIRED' }, { status: 401 })
  }
  return { user }
}

// Middleware helper: require admin role
export async function requireAdmin(
  request: NextRequest
): Promise<{ user: JWTPayload } | NextResponse> {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized', code: 'AUTH_REQUIRED' }, { status: 401 })
  }
  if (user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden', code: 'ADMIN_REQUIRED' }, { status: 403 })
  }
  return { user }
}
