'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

const Sidebar = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleCategory = (name: string) => {
    setExpanded(prev => (prev === name ? null : name));
  };

  const categories = [
    {
      name: 'Electronics',
      href: '/categories/electronics',
      subcategories: ['Phones', 'Laptops'],
    },
    {
      name: 'Fashion',
      href: '/categories/fashion',
      subcategories: ['Men', 'Women'],
    },
    {
      name: 'Home & Living',
      href: '/categories/home',
      subcategories: ['Furniture', 'Decor'],
    },
    {
      name: 'Beauty',
      href: '/categories/beauty',
      subcategories: ['Skincare', 'Makeup'],
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#e8e9eb] border-r p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Categories</h2>
      <nav className="space-y-3">
        {categories.map(({ name, href, subcategories }) => {
          const isOpen = expanded === name;

          return (
            <div key={name}>
              {/* Category link with toggle icon */}
              <button
                onClick={() => toggleCategory(name)}
                className="w-full flex items-center justify-between  py-2 rounded-md text-left hover:bg-gray-100 transition text-gray-800 font-medium"
              >
                <Link href={href} className="flex-1">
                  {name}
                </Link>
                {isOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {/* Subcategories */}
              {isOpen && (
                <div className="ml-5 mt-1 space-y-1 text-sm text-gray-600">
                  {subcategories.map(sub => (
                    <Link
                      key={sub}
                      href={`${href}/${sub.toLowerCase()}`}
                      className="block px-2 py-1 hover:text-blue-600 hover:underline"
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
