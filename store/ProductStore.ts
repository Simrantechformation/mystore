// ProductStore.ts
import { create } from 'zustand';

type Product = {
  _id: string;
  name: string;
  price: number;
  ratings: number;
  category: string;
  images: string[]; 
};

type ProductState = {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: (category?: string) => Promise<void>; // Accept category
};

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,
  error: null,
  fetchProducts: async (category?: string) => {
    set({ loading: true, error: null });
    try {
      const endpoint = category 
        ? `/api/category?category=${encodeURIComponent(category)}`
        : '/api/products';
      const res = await fetch(endpoint);
      const data = await res.json();
      set({ products: data.products, loading: false });
    } catch (err) {
      set({ error: 'Failed to load products', loading: false });
    }
  },
}));
