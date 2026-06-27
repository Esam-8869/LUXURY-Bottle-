export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { reviewSchema } from '@/lib/validators'

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) return authResult

    const body = await request.json()
    const validation = reviewSchema.safeParse(body)
    if (!validation.success) return NextResponse.json({ error: 'Validation failed', code: 'VALIDATION_ERROR', details: validation.error.flatten() }, { status: 400 })

    const { productId, rating, title, body: reviewBody } = validation.data
    const userId = authResult.user.userId

    const existingReview = await prisma.review.findFirst({
      where: { userId, productId }
    })
    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this product', code: 'CONFLICT' }, { status: 409 })
    }

    const orderItem = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: { userId, status: { in: ['DELIVERED', 'SHIPPED', 'CONFIRMED'] } }
      }
    })
    const isVerifiedPurchase = !!orderItem

    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        title,
        body: reviewBody,
        isVerifiedPurchase,
        isApproved: false // Requires admin approval
      }
    })

    return NextResponse.json({ data: review }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
