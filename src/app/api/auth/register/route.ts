export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validators'
import { signToken, setAuthCookie } from '@/lib/auth'
import { sendWelcomeEmail } from '@/lib/email'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = registerSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: validation.error.flatten()
      }, { status: 400 })
    }

    const { email, password, firstName, lastName, phone } = validation.data

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'Conflict', code: 'CONFLICT', message: 'Email already exists' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        phone,
      }
    })

    const token = await signToken({ userId: user.id, email: user.email, role: user.role })
    
    // Send welcome email async (don't await so we don't block response)
    sendWelcomeEmail(user.email, user.firstName).catch(console.error)

    const response = NextResponse.json({
      data: {
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role }
      }
    }, { status: 201 })

    setAuthCookie(response, token)
    return response

  } catch (error) {
    console.error('[REGISTER_ERROR]', error)
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
