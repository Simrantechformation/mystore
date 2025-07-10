'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingCart, Heart } from 'lucide-react';
import Link from 'next/link';
import { useUserStore } from '@/store/UserStore';
import { toast } from 'react-toastify';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  brand: string;
  stock: number;
  ratings: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const CartPage = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserStore();

  const totalPrice = cart
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    .toFixed(2);

  const fetchCart = async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/cart/get?userId=${user._id}`);
      console.log(response, "response1212212")
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      const data = await response.json();
      setCart(data.cart || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (_id: string, delta: number) => {
    setCart(prev =>
      prev.map(item =>
        item.product._id === _id
          ? {
            ...item,
            quantity: Math.max(1, Math.min(item.product.stock, item.quantity + delta)),
          }
          : item
      )
    );
  };


  const moveToWishlist = async (product: Product) => {
    try {
      // 1. Add to wishlist
      await fetch('/api/wishlist/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?._id, productId: product._id }),
      });

      // 2. Remove from cart
      await removeItem(product._id);
    } catch (error) {
      console.error('Error moving to wishlist:', error);
    }
  };

  const removeItem = async (_id: string) => {
    try {
      const response = await fetch('/api/cart/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?._id, productId: _id }),
      });
      if (response.ok) {
        setCart(prev => prev.filter(item => item.product._id !== _id));
      } else {
        const data = await response.json();
      }
    } catch (error) {
      toast.error('Error removing from cart');
    }
  };

  
  useEffect(() => {
    fetchCart();
  }, [user?._id]);

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>{error}</p>
        <button onClick={() => fetchCart()} className="mt-2 underline">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
      {cart.length === 0 ? (
        <div className="text-center py-10">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-gray-600 mb-4">Your cart is empty.</p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-white hover:text-gray-700 hover:border hover:border-gray-700"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            {cart.map((item) => (
              <div
                key={item.product._id}
                className="flex gap-4 border p-4 rounded-md shadow-sm mb-4"
              >
                <div className="w-1/4">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.title}
                    width={150}
                    height={150}
                    className="object-cover w-full h-32 rounded"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.product.title}</h3>
                  <p className="text-gray-500 mb-1">{item.product.brand}</p>
                  <p className="text-xl font-bold text-green-600">${item.product.price}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.product._id, -1)}
                      disabled={item.quantity <= 1}
                      className="p-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="px-4 py-1 border rounded">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product._id, 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="p-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => moveToWishlist(item.product)}
                      className="flex items-center text-sm text-green-600 hover:underline"
                    >
                      <Heart className="w-4 h-4 mr-1" /> Move to wishlist
                    </button>
                    <button
                      onClick={() => removeItem(item.product._id)}
                      className="flex items-center text-sm text-red-600 hover:underline"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="border p-4 rounded-md shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${totalPrice}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span>Shipping</span>
                <span>TBD</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>
              <Link
                href="/checkout"
                className="block mt-4 px-6 py-3 bg-gray-700 text-white text-center rounded-md hover:bg-green-600 hover:text-white hover:border hover:border-gray-700"
              >
                Proceed to Checkout
              </Link>
              <Link
                href="/products"
                className="block mt-4 px-6 py-3 bg-white border border-gray-700 text-gray-700 text-center rounded-md hover:bg-green-700 hover:text-white hover:border-none"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
