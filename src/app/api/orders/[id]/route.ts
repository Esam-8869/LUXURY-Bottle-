export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) return authResult

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: { include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } }, variant: true } },
        payment: true
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found', code: 'NOT_FOUND' }, { status: 404 })
    }

    if (order.userId !== authResult.user.userId && authResult.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden', code: 'FORBIDDEN' }, { status: 403 })
    }

    return NextResponse.json({ data: order }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
