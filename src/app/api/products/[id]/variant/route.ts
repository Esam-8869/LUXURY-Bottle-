export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withCache } from '@/lib/redis'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const color = request.nextUrl.searchParams.get('color')
    if (!color) {
      return NextResponse.json({ error: 'Color parameter is required', code: 'BAD_REQUEST' }, { status: 400 })
    }

    const data = await withCache(`variant:${params.id}:${color}`, 60, async () => {
      const variant = await prisma.productVariant.findFirst({
        where: {
          productId: params.id,
          isActive: true,
          OR: [
            { colorName: { equals: color, mode: 'insensitive' } },
            { hexCode: { equals: color, mode: 'insensitive' } }
          ]
        },
        include: {
          images: { orderBy: { position: 'asc' } },
          inventory: true
        }
      })
      return variant
    })

    if (!data) {
      return NextResponse.json({ error: 'Variant not found', code: 'NOT_FOUND' }, { status: 404 })
    }

    return NextResponse.json({ data }, { status: 200 })

  } catch (error) {
    console.error('[VARIANT_ERROR]', error)
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
