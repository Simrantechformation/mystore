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
  fetchProducts: () => Promise<void>;
};

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,
  error: null,
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      set({ products: data.products, loading: false });
    } catch (err) {
      set({ error: 'Failed to load products', loading: false });
    }
  },
}));
