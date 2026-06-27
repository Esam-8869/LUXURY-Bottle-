import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const { items, total_amount, shipping_address } = body;

    const order = await prisma.order.create({
      data: {
        user_id: payload.userId,
        status: 'PENDING',
        total: total_amount,
        subtotal: total_amount,
        shipping_address_json: JSON.stringify(shipping_address),
        billing_address_json: JSON.stringify(shipping_address),
        OrderItems: {
          create: items.map((item: any) => ({
            product_id: item.product_id,
            variant_id: item.variant_id,
            quantity: item.quantity,
            unit_price: item.price,
            total_price: Number(item.price) * item.quantity,
            product_snapshot_json: JSON.stringify(item.Product),
          }))
        }
      },
      include: {
        OrderItems: true
      }
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order', details: error.message },
      { status: 500 }
    );
  }
}
