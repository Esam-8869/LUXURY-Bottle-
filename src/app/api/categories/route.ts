export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withCache } from '@/lib/redis'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const flat = searchParams.get('flat') === 'true'

    const data = await withCache(`categories:data:${flat}`, 10 * 60, async () => {
      const allCategories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { position: 'asc' },
      })

      if (flat) return allCategories

      // Build tree
      const rootCategories = allCategories.filter(c => !c.parentId)
      const buildTree = (parents: any[]) => {
        return parents.map(parent => ({
          ...parent,
          children: buildTree(allCategories.filter(c => c.parentId === parent.id))
        }))
      }
      return buildTree(rootCategories)
    })

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('[CATEGORIES_ERROR]', error)
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
