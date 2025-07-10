'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch}   className="flex w-full border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-[#364153] transition">
      <input
        type="text"
        placeholder="Search products..."
        className="flex-grow px-3 py-1 border border-gray-300 rounded-l-md focus:outline-none"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        type="submit"
        className="px-4 py-1 bg-[#364153] text-white rounded-r-md hover:bg-white hover:text-[#364153]"
      >
        Search
      </button>
    </form>
  );
}
