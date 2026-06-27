export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request)
    if (auth instanceof NextResponse) return auth

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const email = searchParams.get('email')

    let where: any = {}
    if (status) where.status = status
    if (email) where.user = { email: { contains: email, mode: 'insensitive' } }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { email: true, firstName: true, lastName: true } },
        payment: true
      }
    })
    
    return NextResponse.json({ data: orders }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
