import { connectDB } from '@/lib/mongoose';
import { Product } from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';
import { getProductById } from '@/utils/getProductById'; // Optional helper

// Import this type
import type { NextApiRequest } from 'next';

// FIX: Use the right signature
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = context.params;
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching product', error }, { status: 500 });
  }
}
