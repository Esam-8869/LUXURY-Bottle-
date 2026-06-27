export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) return authResult

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: authResult.user.userId },
      include: {
        items: {
          include: {
            product: { include: { images: { where: { isPrimary: true }, take: 1 } } }
          },
          orderBy: { addedAt: 'desc' }
        }
      }
    })

    return NextResponse.json({ data: wishlist?.items || [] }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) return authResult

    const body = await request.json()
    const productId = body.productId
    if (!productId) return NextResponse.json({ error: 'productId is required', code: 'BAD_REQUEST' }, { status: 400 })

    let wishlist = await prisma.wishlist.findUnique({ where: { userId: authResult.user.userId } })
    if (!wishlist) {
      wishlist = await prisma.wishlist.create({ data: { userId: authResult.user.userId } })
    }

    const existingItem = await prisma.wishlistItem.findUnique({
      where: { wishlistId_productId: { wishlistId: wishlist.id, productId } }
    })

    if (existingItem) {
      await prisma.wishlistItem.delete({ where: { id: existingItem.id } })
      return NextResponse.json({ data: { added: false } }, { status: 200 })
    } else {
      await prisma.wishlistItem.create({ data: { wishlistId: wishlist.id, productId } })
      return NextResponse.json({ data: { added: true } }, { status: 200 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
