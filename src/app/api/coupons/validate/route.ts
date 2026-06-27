export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateCouponSchema } from '@/lib/validators'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = validateCouponSchema.safeParse(body)
    if (!validation.success) return NextResponse.json({ error: 'Validation failed', code: 'VALIDATION_ERROR', details: validation.error.flatten() }, { status: 400 })

    const { code, orderAmount } = validation.data
    const coupon = await prisma.coupon.findUnique({ where: { code } })

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ error: 'Invalid coupon', code: 'INVALID_COUPON' }, { status: 400 })
    }

    const now = new Date()
    if (now < coupon.validFrom || now > coupon.validUntil) {
      return NextResponse.json({ error: 'Coupon expired', code: 'COUPON_EXPIRED' }, { status: 400 })
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json({ error: 'Coupon usage limit reached', code: 'COUPON_LIMIT_REACHED' }, { status: 400 })
    }

    if (coupon.minOrderAmount && Number(orderAmount) < Number(coupon.minOrderAmount)) {
      return NextResponse.json({ error: `Minimum order amount of $${coupon.minOrderAmount} required`, code: 'MIN_ORDER_NOT_MET' }, { status: 400 })
    }

    let calculatedDiscount = 0
    if (coupon.type === 'PERCENTAGE') {
      calculatedDiscount = (Number(orderAmount) * Number(coupon.value)) / 100
    } else if (coupon.type === 'FIXED_AMOUNT') {
      calculatedDiscount = Number(coupon.value)
    } else if (coupon.type === 'FREE_SHIPPING') {
      calculatedDiscount = 0 // handled on frontend
    }

    if (coupon.maxDiscountAmount && calculatedDiscount > Number(coupon.maxDiscountAmount)) {
      calculatedDiscount = Number(coupon.maxDiscountAmount)
    }

    return NextResponse.json({
      data: {
        valid: true,
        discountType: coupon.type,
        discountValue: Number(coupon.value),
        calculatedDiscount
      }
    }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
