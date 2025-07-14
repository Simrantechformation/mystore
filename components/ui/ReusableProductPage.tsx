'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Heart, ShoppingCart, List, LayoutGrid, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import SearchBar from '../forms/SearchBar';
import FilterPanel from '../features/FilterPanel';
import Drawer from '../ui/Drawer';

// Define interfaces for props and product
interface Product {
  _id: string;
  name: string;
  title: string;
  category: string;
  price: number;
  ratings: number;
  images: string[];
}

interface ProductPageProps {
  fetchProductsEndpoint?: string;
  searchEndpoint?: string;
  filterEndpoint?: string;
  wishlistEndpoint?: string;
  cartEndpoint?: string;
  initialFilters?: Record<string, string[]>;
  productsPerPage?: number;
  enableGridView?: boolean;
  enableListView?: boolean;
  className?: string;
  onAddToCart?: (productId: string) => void;
  onToggleWishlist?: (productId: string) => void;
  user?: { _id: string } | null;
  title?: string;
  products?: Product[];
  fetchProducts?: () => Promise<Product[]>;
}

const useWishlistAndCart = (userId: string | undefined, wishlistEndpoint: string, cartEndpoint: string) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [cartIds, setCartIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchWishlistAndCart = async () => {
      if (!userId) return;
      try {
        // Fetch wishlist
        const wishlistRes = await fetch(`${wishlistEndpoint}/get?userId=${userId}`);
        const wishlistData = await wishlistRes.json();
        if (wishlistRes.ok) {
          setWishlistIds(wishlistData.products?.map((p: any) => p._id) || []);
        } else {
          console.error('Error fetching wishlist:', wishlistData.error);
        }

        // Fetch cart
        const cartRes = await fetch(`${cartEndpoint}?userId=${userId}`);
        const cartData = await cartRes.json();
        if (cartRes.ok) {
          setCartIds(cartData.map((item: { productId: string }) => item.productId) || []);
        } else {
          console.error('Error fetching cart:', cartData.error);
        }
      } catch (error) {
        console.error('Error fetching wishlist or cart:', error);
      }
    };
    fetchWishlistAndCart();
  }, [userId, wishlistEndpoint, cartEndpoint]);

  const toggleWishlist = async (productId: string) => {
    if (!userId) {
      toast.error('Please log in to manage wishlist');
      return;
    }
    const isInWishlist = wishlistIds.includes(productId);
    try {
      if (isInWishlist) {
        const res = await fetch(`${wishlistEndpoint}/remove`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, productId }),
        });
        if (res.status === 200) {
          setWishlistIds((prev) => prev.filter((id) => id !== productId));
          const data = await res.json();
          toast.success(data?.message || 'Removed from wishlist');
        }
      } else {
        const res = await fetch(`${wishlistEndpoint}/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, productId }),
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
    if (!userId) {
      toast.error('Please log in to add to cart');
      return;
    }
    try {
      const res = await fetch(`${cartEndpoint}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, quantity: 1 }),
      });
      const data = await res.json();
      if (res.ok) {
        setCartIds((prev) => [...prev, productId]);
        toast.success(data?.message || 'Added to cart');
      } else {
        toast.error(data?.error || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Error adding to cart');
    }
  };

  return { wishlistIds, cartIds, toggleWishlist, moveToCart };
};

const ReusableProductPage: React.FC<ProductPageProps> = ({
  fetchProductsEndpoint = '/api/products',
  searchEndpoint = '/api/products/search',
  filterEndpoint = '/api/products/filter',
  wishlistEndpoint = '/api/wishlist',
  cartEndpoint = '/api/cart',
  initialFilters = {},
  productsPerPage = 6,
  enableGridView = true,
  enableListView = true,
  className = '',
  title = '',
  onAddToCart,
  onToggleWishlist,
  user,
  products: initialProducts,
  fetchProducts: customFetchProducts,
}) => {
  const [view, setView] = useState<'grid' | 'list'>(enableGridView ? 'grid' : 'list');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(!initialProducts);
  const [error, setError] = useState<string>('');

  const { wishlistIds, cartIds, toggleWishlist, moveToCart } = useWishlistAndCart(user?._id, wishlistEndpoint, cartEndpoint);

  useEffect(() => {
    const fetchProducts = async () => {
      if (initialProducts) {
        setProducts(initialProducts);
        setFilteredProducts(initialProducts);
        setLoading(false);
        return;
      }
      try {
        const res = await (customFetchProducts ? customFetchProducts() : fetch(fetchProductsEndpoint).then((res) => res.json()));
        setProducts(res.products || res);
        setFilteredProducts(res.products || res);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [fetchProductsEndpoint, initialProducts, customFetchProducts]);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (!term) {
      setFilteredProducts(products);
      return;
    }
    setSearchLoading(true);
    try {
      const res = await fetch(`${searchEndpoint}?search=${encodeURIComponent(term)}`);
      const data = await res.json();
      if (res.ok) {
        setFilteredProducts(data.products || []);
        setCurrentPage(1);
      } else {
        toast.error(data?.message || 'Failed to search');
      }
    } catch (err) {
      toast.error('Search failed');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleFilterChange = async (updatedFilters: Record<string, string[]>) => {
    setFilters(updatedFilters);
    if (!updatedFilters || Object.keys(updatedFilters).length === 0) {
      setFilteredProducts(products);
      return;
    }
    try {
      const res = await fetch(filterEndpoint, {
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
    }
  };

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const renderStars = (rating: number) => {
    const rounded = Math.round(rating);
    return '★'.repeat(rounded) + '☆'.repeat(5 - rounded);
  };

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

  const totalFiltersApplied = Object.values(filters).reduce<number>(
    (total, arr) => total + (Array.isArray(arr) ? arr.length : 0),
    0
  );

  return (
    <div className={`p-6 mx-auto ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="hidden md:flex flex-1 max-w-lg">
          <SearchBar placeholder="Search products..." onSearch={handleSearch} />
        </div>
        <div className="flex gap-2">
          {enableListView && (
            <button onClick={() => setView('list')}>
              <List className={`w-6 h-6 ${view === 'list' ? 'text-green-600' : 'text-gray-700'}`} />
            </button>
          )}
          {enableGridView && (
            <button onClick={() => setView('grid')}>
              <LayoutGrid className={`w-6 h-6 ${view === 'grid' ? 'text-green-600' : 'text-gray-700'}`} />
            </button>
          )}
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
              <div className="text-yellow-400 mb-2">
                {renderStars(product.ratings)}
                <span className="text-gray-600 text-sm ml-1">({product.ratings.toFixed(1)})</span>
              </div>

              <div className="flex gap-3">
                <button
                  className="p-2 bg-transparent rounded hover:bg-gray-200"
                  title={cartIds.includes(product._id) ? 'Go to cart' : 'Add to cart'}
                  onClick={() => {
                    if (cartIds.includes(product._id)) {
                      window.location.href = '/cart';
                    } else {
                      moveToCart(product._id);
                      onAddToCart?.(product._id);
                    }
                  }}
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    toggleWishlist(product._id);
                    onToggleWishlist?.(product._id);
                  }}
                  className={`p-2 rounded ${wishlistIds.includes(product._id) ? 'bg-transparent' : 'bg-transparent'}`}
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

export default ReusableProductPage;