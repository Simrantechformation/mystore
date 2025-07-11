import { create } from 'zustand';

interface PriceRange {
  min: number;
  max: number;
}

interface FilterState {
  categories: string[];
  brands: string[];
  rating: number;
  priceRange: PriceRange;
  setCategories: (categories: string[]) => void;
  setBrands: (brands: string[]) => void;
  setRating: (rating: number) => void;
  setPriceRange: (range: PriceRange) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  categories: [],
  brands: [],
  rating: 0,
  priceRange: { min: 0, max: 1000 },

  setCategories: (categories) => set({ categories }),
  setBrands: (brands) => set({ brands }),
  setRating: (rating) => set({ rating }),
  setPriceRange: (range) => set({ priceRange: range }),

  clearFilters: () =>
    set({
      categories: [],
      brands: [],
      rating: 0,
      priceRange: { min: 0, max: 1000 },
    }),
}));
