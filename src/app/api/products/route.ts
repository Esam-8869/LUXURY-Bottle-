import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const isTopSelling = searchParams.get('is_top_selling');
    
    let whereClause: any = { is_active: true };
    
    if (category) {
      whereClause.Category = { slug: category };
    }
    
    if (isTopSelling === 'true') {
      whereClause.is_top_selling = true;
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        ProductImages: {
          orderBy: { is_primary: 'desc' }
        },
        ProductVariants: true,
        Category: true,
      },
      orderBy: { created_at: 'desc' },
      take: 20
    });

    return NextResponse.json({ data: products }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
