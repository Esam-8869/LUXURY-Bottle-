export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) return authResult

    const { user: tokenUser } = authResult

    const user = await prisma.user.findUnique({
      where: { id: tokenUser.userId },
      select: { id: true, email: true, firstName: true, lastName: true, role: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'Not found', code: 'NOT_FOUND' }, { status: 404 })
    }

    return NextResponse.json({ data: { user } }, { status: 200 })

  } catch (error) {
    console.error('[ME_ERROR]', error)
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
