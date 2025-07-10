import { connectDB } from '@/lib/mongoose';
import { Product } from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Extract id from URL
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop(); // gets the last segment of /api/products/[id]

    if (!id) {
      return NextResponse.json({ message: 'Product ID missing' }, { status: 400 });
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching product', error }, { status: 500 });
  }
}
