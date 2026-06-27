export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAdmin(request)
    if (auth instanceof NextResponse) return auth
    const body = await request.json()
    
    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: body.name,
        description: body.description,
        basePrice: body.basePrice,
        isActive: body.isActive,
        isFeatured: body.isFeatured,
        isTopSelling: body.isTopSelling,
      }
    })
    return NextResponse.json({ data: updated }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAdmin(request)
    if (auth instanceof NextResponse) return auth
    
    await prisma.product.update({
      where: { id: params.id },
      data: { isActive: false }
    })
    return NextResponse.json({ data: { success: true } }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
