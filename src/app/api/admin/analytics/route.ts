export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request)
    if (auth instanceof NextResponse) return auth

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentOrders = await prisma.order.findMany({
      where: { paymentStatus: 'PAID', createdAt: { gte: thirtyDaysAgo } },
      select: { total: true, createdAt: true }
    })

    // Group by day
    const revenueByDay: Record<string, number> = {}
    recentOrders.forEach(o => {
      const date = o.createdAt.toISOString().split('T')[0]
      revenueByDay[date] = (revenueByDay[date] || 0) + Number(o.total)
    })
    
    const formattedRevenue = Object.entries(revenueByDay).map(([date, revenue]) => ({ date, revenue })).sort((a, b) => a.date.localeCompare(b.date))

    // Just basic metrics for now
    return NextResponse.json({
      data: {
        revenueByDay: formattedRevenue,
        totalOrders30d: recentOrders.length,
        totalRevenue30d: recentOrders.reduce((sum, o) => sum + Number(o.total), 0)
      }
    }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
