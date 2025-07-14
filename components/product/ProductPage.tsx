'use client';

import { useProductStore } from '@/store/ProductStore';
import { useUserStore } from '@/store/UserStore';
import ReusableProductPage from '@/components/ui/ReusableProductPage';
import { useEffect } from 'react';

const ProductPage = () => {
  const { products, fetchProducts, loading, error } = useProductStore();
  const { user } = useUserStore();
  const className = 'bg-white';
  
  useEffect(() => {
    fetchProducts(); // Fetch all products
  }, []);

  if (loading) {
    return (
      <div className={`p-6 mx-auto text-center py-10 h-screen flex flex-col items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 mx-auto text-center py-10 ${className}`}>
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-white hover:text-gray-700 hover:border hover:border-gray-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <ReusableProductPage
      user={user}
      products={products as any}
      fetchProducts={fetchProducts as any}
      productsPerPage={8}
      enableGridView={true}
      enableListView={true}
      wishlistEndpoint="/api/wishlist"
      cartEndpoint="/api/cart"
      fetchProductsEndpoint="/api/products"
      searchEndpoint="/api/products/search"
      filterEndpoint="/api/products/filter"
      className="bg-white"
      title="All Products"
    />
  );
};

export default ProductPage;
