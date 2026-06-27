export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request)
    if (auth instanceof NextResponse) return auth

    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      include: {
        _count: { select: { orders: true } },
        orders: { select: { total: true, paymentStatus: true } }
      }
    })

    const data = customers.map(c => {
      const totalSpent = c.orders.filter(o => o.paymentStatus === 'PAID').reduce((acc, o) => acc + Number(o.total), 0)
      return {
        id: c.id,
        email: c.email,
        name: `${c.firstName} ${c.lastName}`,
        orderCount: c._count.orders,
        totalSpent,
        createdAt: c.createdAt
      }
    })
    
    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
