'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Trash2, ShoppingCart, Heart, LayoutGrid, List } from 'lucide-react';
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

const WishlistPage = () => {
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { user } = useUserStore();

  const fetchWishlist = async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/wishlist/get?userId=${user._id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }
      const data = await response.json();
      setWishlistProducts(data.products || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user?._id]);

  const moveToCart = async (productId: string) => {
    if (!user) {
      alert('Please log in to add to wishlist');
      return;
    }
    setWishlistProducts(prev => prev.filter(product => product._id !== productId));
    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, productId }),
      });
      const data = await res.json();
      if (data.status === 200) {
        toast.success(data?.message || 'Added to cart');
        // ✅ Also remove from backend wishlist
        await removeFromWishlist(productId);
      } else {
        toast.error(data?.error || 'Failed to add to cart');
        await fetchWishlist();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
      await fetchWishlist();
    }
  };
  

  const removeFromWishlist = async (productId: string) => {
    if (!user?._id) return;
    try {
      const response = await fetch('/api/wishlist/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          productId,
        }),
      });
      if (response.status === 200) {
        const data = await response.json();
        toast.success(data?.message || 'Removed from wishlist');
        setWishlistProducts(prev => prev.filter(product => product._id !== productId));
      }
    } catch (error) {
      toast.error('Error removing from wishlist');
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-10">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-white hover:text-gray-700 hover:border hover:border-gray-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-gray-700"></h2>
        <div className="flex gap-2">
          <button onClick={() => setViewMode('grid')}>
            <LayoutGrid className={`w-6 h-6 ${viewMode === 'grid' ? 'text-gray-600' : 'text-gray-500'}`} />
          </button>
          <button onClick={() => setViewMode('list')}>
            <List className={`w-6 h-6 ${viewMode === 'list' ? 'text-gray-600' : 'text-gray-500'}`} />
          </button>
        </div>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-8 sm:py-10">
          <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-base sm:text-lg text-gray-600 mb-4">Your wishlist is empty.</p>
          <Link
            href="/products"
            className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-gray-700 text-white rounded-md hover:bg-white hover:text-gray-700 hover:border hover:border-gray-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {wishlistProducts.map(product => (
            <div key={product._id} className="border p-3 rounded shadow-sm">
              <Image
                src={product.images[0]}
                alt={product.title}
                width={400}
                height={400}
                className="object-cover w-full h-64 group-hover:scale-105 transition-transform duration-300"
              />
              <div className='w-2/3 mt-2'>
                <h3 className="text-lg font-semibold">{product.title}</h3>
                <p className="text-gray-500 mb-1">{product.category}</p>
                <p className="text-xl font-bold text-green-600">${product.price}</p>
                <div className="text-yellow-400 mb-2">★ {product.ratings}</div>
                <div className="flex gap-3">
                  <button onClick={() => moveToCart(product._id)} title="Move to cart" className="p-2 bg-gray-100 rounded hover:bg-gray-200">
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                  <button onClick={() => removeFromWishlist(product._id)} title="Remove" className="p-2 bg-gray-100 rounded hover:bg-gray-200">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {wishlistProducts.map(product => (
            <div key={product._id} className="flex gap-4 border p-4 rounded shadow-sm">
              <Image
                src={product.images[0]}
                alt={product.title}
                width={150}
                height={150}
                className="object-cover w-32 h-32 rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{product.title}</h3>
                <p className="text-sm text-gray-500">{product.brand}</p>
                <p className="text-green-600 font-bold">${product.price}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => moveToCart(product._id)} className="text-sm text-gray-700">
                    <ShoppingCart className="w-4 h-4 inline" /> Move to cart
                  </button>
                  <button onClick={() => removeFromWishlist(product._id)} className="text-sm text-red-500">
                    <Trash2 className="w-4 h-4 inline" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
