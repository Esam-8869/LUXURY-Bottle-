export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('stripe-signature')
    const secret = process.env.STRIPE_WEBHOOK_SECRET

    if (!secret || !signature) {
      return NextResponse.json({ error: 'Webhook secret or signature missing' }, { status: 400 })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2025-02-24.acacia' })
    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, secret)
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const payment = await prisma.payment.findFirst({ where: { gatewayPaymentId: paymentIntent.id } })
      if (payment) {
        await prisma.payment.update({ where: { id: payment.id }, data: { status: 'PAID' } })
        await prisma.order.update({ where: { id: payment.orderId }, data: { paymentStatus: 'PAID' } })
      }
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const payment = await prisma.payment.findFirst({ where: { gatewayPaymentId: paymentIntent.id } })
      if (payment) {
        await prisma.payment.update({ where: { id: payment.id }, data: { status: 'FAILED' } })
        await prisma.order.update({ where: { id: payment.orderId }, data: { paymentStatus: 'FAILED' } })
        // Could release inventory here
      }
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
