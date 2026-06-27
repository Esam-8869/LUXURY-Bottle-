export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: { orderBy: { position: 'asc' } },
        variants: {
          where: { isActive: true },
          include: { images: true, inventory: true }
        },
        category: true,
        frequentlyBoughtTogether: {
          include: {
            relatedProduct: {
              include: { images: { where: { isPrimary: true } } }
            }
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Not found', code: 'NOT_FOUND' }, { status: 404 })
    }

    // Get average rating
    const aggregates = await prisma.review.aggregate({
      where: { productId: product.id, isApproved: true },
      _avg: { rating: true },
      _count: { rating: true }
    })

    const relatedProducts = await prisma.product.findMany({
      where: { categoryId: product.categoryId, id: { not: product.id }, isActive: true },
      take: 4,
      include: { images: { where: { isPrimary: true } } }
    })

    const data = {
      ...product,
      rating: aggregates._avg.rating || 0,
      reviewCount: aggregates._count.rating || 0,
      relatedProducts
    }

    // Recently viewed tracking (async)
    getCurrentUser(request).then(user => {
      if (user) {
        prisma.recentlyViewed.upsert({
          where: { userId_productId: { userId: user.userId, productId: product.id } },
          update: { viewedAt: new Date() },
          create: { userId: user.userId, productId: product.id }
        }).catch(console.error)
      }
    })

    return NextResponse.json({ data }, { status: 200 })

  } catch (error) {
    console.error('[PRODUCT_DETAIL_ERROR]', error)
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
