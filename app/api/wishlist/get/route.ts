// app/api/wishlist/get/route.ts
import { connectDB } from '@/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const userId = req.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const user = await User.findById(userId).populate('wishlist');
    return NextResponse.json({
      products: user?.wishlist || [],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
