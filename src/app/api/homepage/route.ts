export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withCache } from '@/lib/redis'

export async function GET() {
  try {
    const data = await withCache('homepage:data', 5 * 60, async () => {
      const [heroVideos, sections, featuredProducts, topSellingProducts, categories] = await Promise.all([
        prisma.heroVideo.findMany({
          where: { isActive: true },
          orderBy: { position: 'asc' },
        }),
        prisma.homepageSection.findMany({
          where: { isActive: true },
          orderBy: { position: 'asc' },
        }),
        prisma.product.findFirst({
          where: { isActive: true, isFeatured: true },
          include: {
            images: { where: { isPrimary: true }, take: 1 },
            variants: { take: 1 },
            category: true,
          }
        }),
        prisma.product.findMany({
          where: { isActive: true, isTopSelling: true },
          take: 7,
          include: {
            images: { where: { isPrimary: true }, take: 1 },
            variants: { include: { inventory: true } },
          }
        }),
        prisma.category.findMany({
          where: { isActive: true, parentId: null },
          orderBy: { position: 'asc' }
        })
      ])

      return {
        heroVideos,
        sections,
        featuredProduct: featuredProducts,
        topSellingProducts,
        categories
      }
    })

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('[HOMEPAGE_ERROR]', error)
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
