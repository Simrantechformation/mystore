// app/api/wishlist/remove/route.ts
import { connectDB } from '@/lib/mongoose';
import { User } from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { userId, productId } = await req.json();
    if (!userId || !productId) {
      return NextResponse.json({ error: 'Missing userId or productId' }, { status: 400 });
    }
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    user.wishlist = user.wishlist.filter(
      (itemId: string) => itemId.toString() !== productId.toString()
    );
    await user.save();
    return NextResponse.json({ message: 'Removed from wishlist', wishlist: user.wishlist, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
