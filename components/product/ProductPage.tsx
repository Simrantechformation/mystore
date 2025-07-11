'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Heart, ShoppingCart, List, LayoutGrid, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useProductStore } from '@/store/ProductStore';
import { useUserStore } from '@/store/UserStore';
import { toast } from 'react-toastify';
import SearchBar from '../forms/SearchBar';
import FilterPanel from '../features/FilterPanel';
import Drawer from '../ui/Drawer';

const ProductPage = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const { products, fetchProducts, loading, error } = useProductStore();
  const { user } = useUserStore();
  const productsPerPage = 6;
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (!term) {
      setFilteredProducts(products);
      return;
    }
    setSearchLoading(true);
    try {
      const res = await fetch(`/api/products/search?search=${encodeURIComponent(term)}`);
      const data = await res.json();
      if (res.ok) {
        setFilteredProducts(data.products || []);
        setCurrentPage(1); // Reset pagination
      } else {
        toast.error(data?.message || 'Failed to search');
      }
    } catch (err) {
      toast.error('Search failed');
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?._id) return;
      try {
        const res = await fetch(`/api/wishlist/get?userId=${user._id}`);
        const data = await res.json();
        const ids = data.products?.map((p: any) => p._id) || [];
        setWishlistIds(ids);
      } catch (error) {
        console.error('Failed to load wishlist:', error);
      }
    };
    fetchWishlist();
  }, [user?._id]);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      toast.error('Please log in to manage wishlist');
      return;
    }
    const isInWishlist = wishlistIds.includes(productId);
    try {
      if (isInWishlist) {
        const res = await fetch('/api/wishlist/remove', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user._id, productId }),
        });
        if (res.status === 200) {
          setWishlistIds((prev) => prev.filter((id) => id !== productId));
          const data = await res.json();
          toast.success(data?.message || 'Removed from wishlist');
        }
      } else {
        const res = await fetch('/api/wishlist/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user._id, productId }),
        });

        if (res.ok) {
          setWishlistIds((prev) => [...prev, productId]);
          toast.success('Added to wishlist');
        }
      }
    } catch (err) {
      toast.error('Something went wrong');
      console.error(err);
    }
  };

  const moveToCart = async (productId: string) => {
    if (!user?._id) {
      toast.error('Please log in to add to cart');
      return;
    }
    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          productId,
          quantity: 1,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data?.message || 'Added to cart');
        // optionally: toggleWishlist(productId); // if you want to remove from wishlist
      } else {
        toast.error(data?.error || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Error adding to cart');
    }
  };

  const handleFilterChange = async (updatedFilters: Record<string, string[]>) => {
    setFilters(updatedFilters);
    if (!updatedFilters || Object.keys(updatedFilters).length === 0) {
      setFilteredProducts(products); // fallback
      return;
    }

    try {
      const res = await fetch('/api/products/filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters: updatedFilters }),
      });

      const data = await res.json();
      if (res.ok) {
        setFilteredProducts(data.products || []);
        setCurrentPage(1);
      } else {
        toast.error(data?.message || 'Failed to apply filters');
      }
    } catch (err) {
      toast.error('Error fetching filtered products');
      console.error(err);
    }
  };

  const renderStars = (rating: number) => {
    const rounded = Math.round(rating); // round to nearest whole number
    return '★'.repeat(rounded) + '☆'.repeat(5 - rounded);
  };

  if (loading) {
    return (
      <div className="p-6 mx-auto text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6  mx-auto text-center py-10">
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

  const totalFiltersApplied = Object.values(filters).reduce<number>(
    (total, arr) => total + (Array.isArray(arr) ? arr.length : 0),
    0
  );

  return (
    <div className="p-6  mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Products</h2>
        {/* Search Bar srecah by title */}
        <div className="hidden md:flex flex-1 max-w-lg">
          <SearchBar placeholder="Search products..." onSearch={handleSearch} />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('list')}>
            <List className={`w-6 h-6 ${view === 'list' ? 'text-green-600' : 'text-gray-700'}`} />
          </button>
          <button onClick={() => setView('grid')}>
            <LayoutGrid className={`w-6 h-6 ${view === 'grid' ? 'text-green-600' : 'text-gray-700'}`} />
          </button>
          <div className="relative">
            <button onClick={() => setIsFilterOpen(true)}>
              <SlidersHorizontal className="w-6 h-6 text-gray-700 mt-2" />
            </button>
            {totalFiltersApplied > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-4 text-xs bg-green-500 text-white rounded-full flex items-center justify-center">
                {totalFiltersApplied}
              </span>
            )}
          </div>
        </div>
      </div>

      <Drawer isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} title="Filters">
        <FilterPanel
          filters={filters}
          onClose={() => setIsFilterOpen(false)}
          onFilterChange={handleFilterChange}
          products={products}
        />
      </Drawer>

      <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6' : 'space-y-4'}>
        {paginatedProducts.map((product) => (
          <div
            key={product._id}
            className={`border p-4 rounded-md shadow-sm hover:shadow-md transition cursor-pointer ${view === 'list' ? 'flex gap-4 items-center' : ''}`}
          >
            <div className={view === 'list' ? 'w-1/3' : ''}>
              <Link href={`/products/${product._id}`}>
                <div className="relative overflow-hidden rounded-md group">
                  <Image
                    src={product.images[0] || ''}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="object-cover w-full h-64 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>
            </div>

            <div className={`${view === 'list' ? 'w-2/3' : ''} mt-2`}>
              <h3 className="text-lg font-semibold">{product.title}</h3>
              <p className="text-gray-500 mb-1">{product.category}</p>
              <p className="text-xl font-bold text-green-600">${product.price}</p>
              {/* <div className="text-yellow-400 mb-2">★★  {product?.ratings}</div> */}
              <div className="text-yellow-400 mb-2">
                {renderStars(product.ratings)}
                <span className="text-gray-600 text-sm ml-1">({product.ratings.toFixed(1)})</span>
              </div>

              <div className="flex gap-3">
                <button className="p-2 bg-transparent rounded hover:bg-gray-200" title="Add to cart" onClick={() => moveToCart(product._id)}>
                  <ShoppingCart className="w-5 h-5" />
                </button>
                <button
                  onClick={() => toggleWishlist(product._id)}
                  className={`p-2 rounded ${wishlistIds.includes(product._id) ? 'bg-tranparent' : 'bg-transparent'}`}
                  title={wishlistIds.includes(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart
                    className={`w-5 h-5 ${wishlistIds.includes(product._id) ? 'text-red-600 fill-red-600' : 'text-gray-600'}`}
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 rounded ${currentPage === i + 1 ? 'bg-gray-600 text-white' : 'bg-gray-200'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
