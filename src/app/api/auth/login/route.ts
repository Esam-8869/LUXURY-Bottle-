import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { verifyPassword, generateToken } from '@/lib/auth';
import { loginSchema } from '@/lib/validators';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(validatedData.password, user.password_hash);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      );
    }

    const token = generateToken({ userId: user.id, role: user.role });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      },
      token
    }, { status: 200 });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed', details: error.message },
      { status: 400 }
    );
  }
}
