import { connectDB } from '@/lib/mongoose';
import { Product } from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  await connectDB();
  const { filters } = await req.json(); // { Category: ['Shoes'], Brand: ['Nike'] }

  const query: any = {};

  if (filters?.Category?.length) {
    query.category = { $in: filters.Category };
  }

  if (filters?.Brand?.length) {
    query.brand = { $in: filters.Brand };
  }

  try {
    const products = await Product.find(query);
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch filtered products' }, { status: 500 });
  }
}
