export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '12', 10)
    const category = searchParams.get('category')
    const sort = searchParams.get('sort') || 'popular'
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const color = searchParams.get('color')

    const where: Prisma.ProductWhereInput = { isActive: true }

    if (category) {
      // Find category and its children to include all products
      const cat = await prisma.category.findUnique({ where: { slug: category }, include: { children: true } })
      if (cat) {
        const catIds = [cat.id, ...cat.children.map(c => c.id)]
        where.categoryId = { in: catIds }
      }
    }

    if (minPrice || maxPrice) {
      where.basePrice = {}
      if (minPrice) (where.basePrice as any).gte = parseFloat(minPrice)
      if (maxPrice) (where.basePrice as any).lte = parseFloat(maxPrice)
    }

    if (color) {
      where.variants = {
        some: {
          colorName: { equals: color, mode: 'insensitive' }
        }
      }
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = {}
    switch (sort) {
      case 'price_asc': orderBy = { basePrice: 'asc' }; break
      case 'price_desc': orderBy = { basePrice: 'desc' }; break
      case 'newest': orderBy = { createdAt: 'desc' }; break
      case 'popular': orderBy = { isTopSelling: 'desc' }; break
      default: orderBy = { isTopSelling: 'desc' }; break
    }

    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          variants: { include: { inventory: true } },
          category: true,
          _count: { select: { reviews: true } }
        }
      }),
      prisma.product.count({ where })
    ])

    return NextResponse.json({
      data: {
        data: products,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }
    }, { status: 200 })

  } catch (error) {
    console.error('[PRODUCTS_ERROR]', error)
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
