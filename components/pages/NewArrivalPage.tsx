'use client';

import { useEffect } from 'react';
import { useProductStore } from '@/store/ProductStore';
import ReusableProductPage from '../ui/ReusableProductPage';
import { useUserStore } from '@/store/UserStore';

const NewArrivalPage = () => {
  const { products, fetchProducts, loading, error } = useProductStore();
  const { user } = useUserStore();
  const className = 'bg-white';

  useEffect(() => {
    fetchProducts('New Arrivals'); // Fetch products for Beauty category
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
    <div className="p-6 max-w-7xl mx-auto">
      <ReusableProductPage
        products={products as any}  
        productsPerPage={8} 
        user={user}
        enableListView={true}
        enableGridView={true}
        wishlistEndpoint="/api/wishlist"
        cartEndpoint="/api/cart"
        fetchProductsEndpoint="/api/products"
        searchEndpoint="/api/products/search"
        filterEndpoint="/api/products/filter"
        className="bg-white"
        title="New Arrivals"
      />
    </div>
  );
};

export default NewArrivalPage;
