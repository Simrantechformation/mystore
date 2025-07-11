// app/api/products/route.ts
import { connectDB } from '@/lib/mongoose';
import { Product } from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';

// app/api/products/route.ts
export async function GET() {
  try {
    await connectDB();

    const products = await Product.find(); // ← fetch all products

    return NextResponse.json({
      status: 'success',
      products,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
