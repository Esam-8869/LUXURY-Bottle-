export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const sort = searchParams.get('sort') || 'newest'

    let orderBy: any = { createdAt: 'desc' }
    if (sort === 'highest') orderBy = { rating: 'desc' }
    if (sort === 'lowest') orderBy = { rating: 'asc' }

    const skip = (page - 1) * limit

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId: params.id, isApproved: true },
        orderBy,
        skip,
        take: limit,
        include: {
          user: { select: { firstName: true, lastName: true } }
        }
      }),
      prisma.review.count({ where: { productId: params.id, isApproved: true } })
    ])

    // Format names for privacy
    const formattedReviews = reviews.map(r => ({
      ...r,
      user: {
        name: `${r.user.firstName} ${r.user.lastName.charAt(0)}.`
      }
    }))

    return NextResponse.json({
      data: {
        data: formattedReviews,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }
    }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
