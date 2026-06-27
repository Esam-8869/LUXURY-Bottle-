export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { loginSchema } from '@/lib/validators'
import { signToken, setAuthCookie } from '@/lib/auth'
import { checkRateLimit } from '@/lib/redis'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 attempts per 15 min per IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const limit = await checkRateLimit(`ratelimit:login:${ip}`, 5, 15 * 60)
    if (!limit.allowed) {
      return NextResponse.json({ error: 'Too many attempts', code: 'RATE_LIMIT_EXCEEDED' }, { status: 429 })
    }

    const body = await request.json()
    const validation = loginSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: validation.error.flatten()
      }, { status: 400 })
    }

    const { email, password } = validation.data
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json({ error: 'Unauthorized', code: 'AUTH_FAILED', message: 'Invalid email or password' }, { status: 401 })
    }

    const token = await signToken({ userId: user.id, email: user.email, role: user.role })

    const response = NextResponse.json({
      data: {
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role }
      }
    }, { status: 200 })

    setAuthCookie(response, token)

    // Merge guest cart if sessionId cookie exists
    const sessionId = request.cookies.get('session_id')?.value
    if (sessionId) {
      const guestCart = await prisma.cart.findUnique({ where: { sessionId }, include: { items: true } })
      if (guestCart && guestCart.items.length > 0) {
        // Find user cart
        let userCart = await prisma.cart.findUnique({ where: { userId: user.id }, include: { items: true } })
        if (!userCart) {
          userCart = await prisma.cart.create({ data: { userId: user.id }, include: { items: true } })
        }
        // Move items
        for (const item of guestCart.items) {
          const existing = userCart.items.find(i => i.variantId === item.variantId)
          if (existing) {
            await prisma.cartItem.update({
              where: { id: existing.id },
              data: { quantity: existing.quantity + item.quantity }
            })
          } else {
            await prisma.cartItem.create({
              data: { cartId: userCart.id, productId: item.productId, variantId: item.variantId, quantity: item.quantity }
            })
          }
        }
        await prisma.cart.delete({ where: { id: guestCart.id } })
        response.cookies.delete('session_id') // clear session id
      }
    }

    return response

  } catch (error) {
    console.error('[LOGIN_ERROR]', error)
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
