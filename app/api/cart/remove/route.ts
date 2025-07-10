// app/api/cart/remove/route.ts
import { connectDB } from '@/lib/mongoose';
import { Cart } from '@/models/Cart';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const { userId, productId } = await req.json();

    if (!userId || !productId) {
      return NextResponse.json({ error: 'Missing userId or productId' }, { status: 400 });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    // Remove product from cart
    cart.items = cart.items.filter((item: any) => item?.productId.toString() !== productId.toString());

    await cart.save();

    return NextResponse.json({ message: 'Product removed from cart', status: 200 });
  } catch (error: any) {
    console.error('Error removing product from cart:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
