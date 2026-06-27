export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { checkoutSchema } from '@/lib/validators'
import { sendOrderConfirmation } from '@/lib/email'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2025-02-24.acacia',
})

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) return authResult
    const { userId, email } = authResult.user

    const body = await request.json()
    const validation = checkoutSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: 'Validation failed', code: 'VALIDATION_ERROR', details: validation.error.flatten() }, { status: 400 })
    }

    const { shippingAddress, billingAddress, couponCode, paymentMethod, paymentToken } = validation.data

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { variant: true, product: true } } }
    })

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty', code: 'CART_EMPTY' }, { status: 400 })
    }

    // Server-side price recalculation
    let subtotal = 0
    const outOfStockItems = []

    for (const item of cart.items) {
      // In a real robust system with high concurrency, you'd do a SELECT ... FOR UPDATE here
      // Prisma doesn't natively support pessimistic locks without $queryRaw yet. 
      // We will do a transaction check later.
      if (item.variant.stockQuantity < item.quantity) {
        outOfStockItems.push(item)
      }
      subtotal += Number(item.variant.price) * item.quantity
    }

    if (outOfStockItems.length > 0) {
      return NextResponse.json({ error: 'Some items are out of stock', code: 'OUT_OF_STOCK', outOfStockItems }, { status: 409 })
    }

    let discountAmount = 0
    let couponId = null

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } })
      if (coupon && coupon.isActive) {
        if (coupon.type === 'PERCENTAGE') discountAmount = (subtotal * Number(coupon.value)) / 100
        else if (coupon.type === 'FIXED_AMOUNT') discountAmount = Number(coupon.value)
        if (coupon.maxDiscountAmount && discountAmount > Number(coupon.maxDiscountAmount)) discountAmount = Number(coupon.maxDiscountAmount)
        couponId = coupon.id
      }
    }

    const shippingCost = subtotal > 100 ? 0 : 10
    const taxAmount = (subtotal - discountAmount) * 0.18 // 18% tax
    const total = subtotal - discountAmount + shippingCost + taxAmount

    // Begin Transaction
    const orderResult = await prisma.$transaction(async (tx) => {
      // Create Order
      const order = await tx.order.create({
        data: {
          userId,
          status: 'PENDING',
          subtotal,
          discountAmount,
          shippingCost,
          taxAmount,
          total,
          couponId,
          shippingAddressJson: shippingAddress,
          billingAddressJson: billingAddress,
          paymentStatus: 'PENDING',
          paymentMethod,
        }
      })

      // Create items, deduct stock, log inventory
      for (const item of cart.items) {
        const itemTotal = Number(item.variant.price) * item.quantity
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice: item.variant.price,
            totalPrice: itemTotal,
            productSnapshotJson: { name: item.product.name, color: item.variant.colorName }
          }
        })

        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stockQuantity: { decrement: item.quantity } }
        })
        
        await tx.inventory.update({
          where: { variantId: item.variantId },
          data: { quantity: { decrement: item.quantity } }
        })

        await tx.inventoryLog.create({
          data: {
            variantId: item.variantId,
            changeAmount: -item.quantity,
            reason: 'SALE',
            referenceId: order.id
          }
        })
      }

      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usageCount: { increment: 1 } }
        })
      }

      let gatewayPaymentId = 'mock_gateway_id'
      // Process Stripe Payment if token provided (or handle via webhook later)
      // For this implementation, assume synchronous charge if token is present
      if (paymentMethod === 'stripe' && paymentToken) {
        try {
          const charge = await stripe.charges.create({
            amount: Math.round(total * 100),
            currency: 'usd',
            source: paymentToken, // from stripe.js
            description: `Order ${order.id}`,
          })
          gatewayPaymentId = charge.id
        } catch (e) {
          throw new Error('Payment failed') // Rolls back transaction
        }
      }

      // Create Payment Record
      await tx.payment.create({
        data: {
          orderId: order.id,
          gateway: paymentMethod === 'stripe' ? 'STRIPE' : 'RAZORPAY',
          gatewayPaymentId,
          amount: total,
          currency: 'USD',
          status: 'PAID' // Assumed paid if synchronous
        }
      })

      await tx.order.update({
        where: { id: order.id },
        data: { paymentStatus: 'PAID', paymentReference: gatewayPaymentId }
      })

      // Clear Cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } })

      return order
    })

    // Async tasks
    const orderItemsForEmail = cart.items.map(i => ({ name: i.product.name, quantity: i.quantity, price: Number(i.variant.price) }))
    sendOrderConfirmation(email, {
      orderNumber: orderResult.id.substring(orderResult.id.length - 8).toUpperCase(),
      total: total.toFixed(2),
      items: orderItemsForEmail
    }).catch(console.error)

    return NextResponse.json({
      data: {
        orderId: orderResult.id,
        orderNumber: orderResult.id.substring(orderResult.id.length - 8).toUpperCase(),
        total: orderResult.total,
        status: orderResult.status,
        paymentStatus: orderResult.paymentStatus
      }
    }, { status: 200 })

  } catch (error: any) {
    console.error('[CHECKOUT_ERROR]', error)
    if (error.message === 'Payment failed') {
      return NextResponse.json({ error: 'Payment processing failed', code: 'PAYMENT_FAILED' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
