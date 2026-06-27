export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { addToCartSchema, updateCartItemSchema } from '@/lib/validators'

async function getCartIdentifier(request: NextRequest) {
  const user = await getCurrentUser(request)
  const sessionId = request.cookies.get('session_id')?.value
  return { userId: user?.userId, sessionId }
}

async function getCartData(cartId: string) {
  return prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        include: {
          product: { include: { images: { where: { isPrimary: true } } } },
          variant: { include: { inventory: true } }
        },
        orderBy: { addedAt: 'desc' }
      }
    }
  })
}

export async function GET(request: NextRequest) {
  try {
    const { userId, sessionId } = await getCartIdentifier(request)
    if (!userId && !sessionId) return NextResponse.json({ data: { items: [], subtotal: 0 } }, { status: 200 })

    const where = userId ? { userId } : { sessionId }
    const cart = await prisma.cart.findUnique({ where, include: { items: { include: { product: { include: { images: { where: { isPrimary: true } } } }, variant: { include: { inventory: true } } } } } })
    
    if (!cart) return NextResponse.json({ data: { items: [], subtotal: 0 } }, { status: 200 })
    return NextResponse.json({ data: cart }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = addToCartSchema.safeParse(body)
    if (!validation.success) return NextResponse.json({ error: 'Validation failed', code: 'VALIDATION_ERROR', details: validation.error.flatten() }, { status: 400 })

    const { productId, variantId, quantity } = validation.data
    const { userId, sessionId } = await getCartIdentifier(request)

    // Check stock
    const variant = await prisma.productVariant.findUnique({ where: { id: variantId }, include: { inventory: true } })
    if (!variant || (variant.inventory?.quantity || 0) < quantity) {
      return NextResponse.json({ error: 'Not enough stock', code: 'OUT_OF_STOCK' }, { status: 409 })
    }

    let cartId = ''
    if (userId) {
      let cart = await prisma.cart.findUnique({ where: { userId } })
      if (!cart) cart = await prisma.cart.create({ data: { userId } })
      cartId = cart.id
    } else {
      let currentSession = sessionId
      if (!currentSession) {
        currentSession = Math.random().toString(36).substring(2, 15)
      }
      let cart = await prisma.cart.findUnique({ where: { sessionId: currentSession } })
      if (!cart) cart = await prisma.cart.create({ data: { sessionId: currentSession } })
      cartId = cart.id
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_variantId: { cartId, variantId } }
    })

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      })
    } else {
      await prisma.cartItem.create({
        data: { cartId, productId, variantId, quantity }
      })
    }

    const updatedCart = await getCartData(cartId)
    const res = NextResponse.json({ data: updatedCart }, { status: 200 })
    if (!userId && !sessionId) {
      const newSessionCart = await prisma.cart.findUnique({ where: { id: cartId } })
      res.cookies.set('session_id', newSessionCart!.sessionId!, { path: '/', maxAge: 30 * 24 * 60 * 60 })
    }
    return res
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = updateCartItemSchema.safeParse(body)
    if (!validation.success) return NextResponse.json({ error: 'Validation', code: 'VALIDATION_ERROR' }, { status: 400 })
    
    const { cartItemId, quantity } = validation.data
    const item = await prisma.cartItem.findUnique({ where: { id: cartItemId } })
    if (!item) return NextResponse.json({ error: 'Not found', code: 'NOT_FOUND' }, { status: 404 })

    if (quantity === 0) {
      await prisma.cartItem.delete({ where: { id: cartItemId } })
    } else {
      await prisma.cartItem.update({ where: { id: cartItemId }, data: { quantity } })
    }

    const updatedCart = await getCartData(item.cartId)
    return NextResponse.json({ data: updatedCart }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId, sessionId } = await getCartIdentifier(request)
    if (!userId && !sessionId) return NextResponse.json({ data: { success: true } }, { status: 200 })

    const where = userId ? { userId } : { sessionId }
    const cart = await prisma.cart.findUnique({ where })
    
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
    }
    
    return NextResponse.json({ data: { success: true } }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
