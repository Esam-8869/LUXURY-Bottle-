export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { OrderStatus } from '@prisma/client'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAdmin(request)
    if (auth instanceof NextResponse) return auth
    const body = await request.json()
    
    const updated = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: body.status as OrderStatus,
        trackingNumber: body.trackingNumber,
      }
    })
    // Ideally, send email notification on status change here
    return NextResponse.json({ data: updated }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
