// app/api/cart/get/route.ts
import { connectDB } from "@/lib/mongoose";
import { Cart } from "@/models/Cart";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.nextUrl.searchParams.get("userId");
    console.log("User ID from query:", userId);
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const cart = await Cart.findOne({ userId }).populate('items.productId');
    console.log("Cart from DB:", cart);

    if (!cart) {
      return NextResponse.json({ cart: [] });
    }

    const formattedCart = cart.items.map((item: any) => ({
      product: item.productId,
      quantity: item.quantity,
    }));

    return NextResponse.json({ cart: formattedCart });
  } catch (error: any) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ message: "Error fetching cart" }, { status: 500 });
  }
}
