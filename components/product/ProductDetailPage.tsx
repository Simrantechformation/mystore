'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Heart } from 'lucide-react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    rating: number;
    specs: string[];
    images: string[];
    category: string;
}

const ProductDetailPage = () => {
    const params = useParams();
    const id = params.id as string;
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState<string>('');

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
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    if (loading) return <div className="p-6">Loading...</div>;
    if (!product) return <div className="p-6 text-red-500">Product not found</div>;

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
                            className={`border rounded-md cursor-pointer ${mainImage === img ? 'ring-2 ring-blue-500' : ''
                                }`}
                            onClick={() => setMainImage(img)}
                        />
                    ))}
                </div>
            </div>

            {/* Right: Details */}
            <div className="flex-1 space-y-4">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <p className="text-gray-500">{product.description}</p>
                <p className="text-green-600 text-2xl font-semibold">${product.price}</p>
                <p className="text-yellow-400">★ {product.rating}</p>

                <ul className="list-disc pl-6 text-gray-700">
                    {product.specs?.map((s, i) => (
                        <li key={i}>{s}</li>
                    ))}
                </ul>

                <div className="flex gap-4 mt-4">
                    <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4" /> Add to Cart
                    </button>
                    <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 flex items-center gap-2">
                        <Heart className="w-4 h-4" /> Wishlist
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
