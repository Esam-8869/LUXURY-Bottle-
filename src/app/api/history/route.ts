export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) return authResult

    const body = await request.json()
    const productId = body.productId
    if (!productId) return NextResponse.json({ error: 'productId is required', code: 'BAD_REQUEST' }, { status: 400 })

    await prisma.recentlyViewed.upsert({
      where: { userId_productId: { userId: authResult.user.userId, productId } },
      update: { viewedAt: new Date() },
      create: { userId: authResult.user.userId, productId }
    })

    // Keep max 10
    const allViews = await prisma.recentlyViewed.findMany({
      where: { userId: authResult.user.userId },
      orderBy: { viewedAt: 'desc' }
    })

    if (allViews.length > 10) {
      const toDelete = allViews.slice(10).map(v => v.id)
      await prisma.recentlyViewed.deleteMany({
        where: { id: { in: toDelete } }
      })
    }

    return NextResponse.json({ data: { success: true } }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
