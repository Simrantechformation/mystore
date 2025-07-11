'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Heart } from 'lucide-react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { toast } from 'react-toastify';
import { useUserStore } from '@/store/UserStore';

interface Product {
    _id: string;
    name: string;
    title: string;
    description: string;
    price: number;
    ratings: number;
    specs: string[];
    images: string[];
    category: string;
}

const ProductDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [product, setProduct] = useState<Product | null>(null);
    const [wishlistIds, setWishlistIds] = useState<string[]>([]);
    const [cartIds, setCartIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [mainImage, setMainImage] = useState<string>('');
    const { user } = useUserStore();

    // Fetch product by ID
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                const data = await res.json();
                setProduct(data);
                setMainImage(data.images?.[0] || '');
            } catch (error) {
                console.error('Error fetching product:', error);
                setError('Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    // Fetch user's wishlist and cart
    useEffect(() => {
        const fetchWishlistAndCart = async () => {
            if (!user?._id) return;
            try {
                // Fetch wishlist
                const wishlistRes = await fetch(`/api/wishlist?userId=${user._id}`);
                const wishlistData = await wishlistRes.json();
                if (wishlistRes.ok) {
                    setWishlistIds(wishlistData.map((item: { productId: string }) => item.productId));
                } else {
                    console.error('Error fetching wishlist:', wishlistData.error);
                }

                // Fetch cart
                const cartRes = await fetch(`/api/cart?userId=${user._id}`);
                const cartData = await cartRes.json();
                if (cartRes.ok) {
                    setCartIds(cartData.map((item: { productId: string }) => item.productId));
                } else {
                    console.error('Error fetching cart:', cartData.error);
                }
            } catch (error) {
                console.error('Error fetching wishlist or cart:', error);
            }
        };

        if (user?._id) fetchWishlistAndCart();
    }, [user]);

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

    const goToCart = () => {
        router.push('/cart');
    };

    if (loading) {
        return (
            <div className="p-6 max-w-7xl mx-auto text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading your product details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 max-w-7xl mx-auto text-center py-10">
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

    if (!product) {
        return (
            <div className="p-6 max-w-7xl mx-auto text-center py-10">
                <p className="text-red-500 mb-4">Product not found</p>
            </div>
        );
    }

    const renderStars = (rating: number) => {
        const rounded = Math.round(rating); // round to nearest whole number
        return '★'.repeat(rounded) + '☆'.repeat(5 - rounded);
    };

    return (
        <div className="p-6 flex flex-col lg:flex-row gap-6">
            {/* Left: Main Image + Thumbnails */}
            <div className="flex-1">
                <Zoom>
                    <Image
                        src={mainImage}
                        alt={product.name}
                        width={500}
                        height={500}
                        className="w-full h-96 object-contain rounded-lg border"
                    />
                </Zoom>

                <div className="flex gap-3 mt-4">
                    {product.images.map((img, idx) => (
                        <Image
                            key={idx}
                            src={img}
                            alt={`Thumbnail ${idx}`}
                            width={80}
                            height={80}
                            className={`border rounded-md cursor-pointer ${mainImage === img ? 'ring-2 ring-blue-500' : ''}`}
                            onClick={() => setMainImage(img)}
                        />
                    ))}
                </div>
            </div>

            {/* Right: Details */}
            <div className="flex-1 space-y-3">
                <p className="text-gray-500 mb-1 text-sm">{product.category}</p>
                <h1 className="text-3xl font-bold text-gray-700">{product?.title}</h1>
                <p className="text-gray-500">{product?.description}</p>
                <p className="text-green-600 text-2xl font-semibold">${product?.price}</p>
                <p className="text-yellow-400">
                    {renderStars(product.ratings)}
                    <span className="text-gray-600 text-sm ml-1">({product.ratings.toFixed(1)})</span>
                </p>

                <ul className="list-disc pl-6 text-gray-700">
                    {product.specs?.map((s, i) => (
                        <li key={i}>{s}</li>
                    ))}
                </ul>

                <div className="flex gap-4 mt-4">
                    <button
                        className={`${cartIds.includes(product._id) ? "bg-gray-500" : "bg-gray-700"} text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2`}
                        onClick={() => (cartIds.includes(product._id) ? goToCart() : moveToCart(product._id))}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        {cartIds.includes(product._id) ? 'Move to Cart' : 'Add to Cart'}
                    </button>
                    <button
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 flex items-center gap-2"
                        onClick={() => toggleWishlist(product._id)}
                    >
                        <Heart
                            className={`w-5 h-5 ${wishlistIds.includes(product._id) ? 'text-red-600 fill-red-600' : 'text-gray-600'}`}
                        />
                        Wishlist
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;