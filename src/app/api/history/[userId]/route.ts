export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) return authResult
    
    if (authResult.user.userId !== params.userId && authResult.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden', code: 'FORBIDDEN' }, { status: 403 })
    }

    const views = await prisma.recentlyViewed.findMany({
      where: { userId: params.userId },
      orderBy: { viewedAt: 'desc' },
      take: 10,
      include: {
        product: { include: { images: { where: { isPrimary: true }, take: 1 } } }
      }
    })

    return NextResponse.json({ data: views.map(v => v.product) }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
