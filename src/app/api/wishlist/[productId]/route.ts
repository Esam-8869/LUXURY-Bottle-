export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function DELETE(request: NextRequest, { params }: { params: { productId: string } }) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) return authResult

    const wishlist = await prisma.wishlist.findUnique({ where: { userId: authResult.user.userId } })
    if (wishlist) {
      await prisma.wishlistItem.deleteMany({
        where: { wishlistId: wishlist.id, productId: params.productId }
      })
    }
    
    return NextResponse.json({ data: { success: true } }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
