'use client';

import { useSearchStore } from '@/store/SearchStore';
import { X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash';

export default function SearchBar({
  placeholder = 'Search products...',
  className = '',
  onSearch,
}: {
  placeholder?: string;
  className?: string;
  onSearch?: (term: string) => void;
}) {
  const { searchTerm, setSearchTerm } = useSearchStore();
  const [localSearch, setLocalSearch] = useState(searchTerm);

  // Debounced search handler
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        const trimmed = value.trim();
        setSearchTerm(trimmed);
        onSearch?.(trimmed);
      }, 500), // 500ms debounce
    [onSearch, setSearchTerm]
  );

  useEffect(() => {
    debouncedSearch(localSearch);

    // Cleanup on unmount
    return () => {
      debouncedSearch.cancel();
    };
  }, [localSearch, debouncedSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    debouncedSearch.cancel(); // cancel debounce and search immediately
    const trimmed = localSearch.trim();
    setSearchTerm(trimmed);
    onSearch?.(trimmed);
  };

  const handleClear = () => {
    setLocalSearch('');
    setSearchTerm('');
    onSearch?.('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center w-full border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-[#364153] transition ${className}`}
    >
      <input
        type="text"
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        placeholder={placeholder}
        className="flex-grow px-3 py-1 border-none outline-none"
      />

      {localSearch && (
        <button
          type="button"
          onClick={handleClear}
          className="px-2 text-gray-500 hover:text-red-500 focus:outline-none"
          title="Clear"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <button
        type="submit"
        className="px-4 py-1 bg-[#364153] text-white rounded-r-md hover:bg-white hover:text-[#364153]"
      >
        Search
      </button>
    </form>
  );
}
