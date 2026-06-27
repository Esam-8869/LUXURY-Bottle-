export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
// import crypto from 'crypto'
// import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  // Placeholder for Razorpay webhook validation
  return NextResponse.json({ received: true }, { status: 200 })
}
