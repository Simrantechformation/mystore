// app/api/beauty-products/route.ts
import { connectDB } from '@/lib/mongoose';
import { Product } from '@/models/Product';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // (Optional: for dynamic behavior)

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({ category: 'Beauty' });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching beauty products:', error);
    return NextResponse.json({ error: 'Failed to fetch beauty products' }, { status: 500 });
  }
}
