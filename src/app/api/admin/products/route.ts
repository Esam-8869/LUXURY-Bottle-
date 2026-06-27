export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request)
    if (auth instanceof NextResponse) return auth

    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    
    let where: any = {}
    if (search) where.name = { contains: search, mode: 'insensitive' }
    if (category) where.categoryId = category

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        variants: { include: { inventory: true } },
        images: true
      }
    })
    
    return NextResponse.json({ data: products }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin(request)
    if (auth instanceof NextResponse) return auth

    const body = await request.json()
    // Validation omitted for brevity, assuming well-formed admin payload
    
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        basePrice: body.basePrice,
        categoryId: body.categoryId,
        variants: {
          create: body.variants.map((v: any) => ({
            colorName: v.colorName,
            hexCode: v.hexCode,
            sku: v.sku,
            price: v.price,
            stockQuantity: v.stockQuantity
          }))
        }
      }
    })

    return NextResponse.json({ data: product }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
