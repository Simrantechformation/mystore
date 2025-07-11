'use client';

import { useState, useEffect } from 'react';

interface FilterPanelProps {
  filters: Record<string, string[]>;
  onFilterChange: (filters: Record<string, string[]>) => void;
  onClose: () => void;
  products: any[];
}

const categoryOptions = ['Footwear', 'Clothing', 'Accessories'];

const FilterPanel = ({ filters, onFilterChange, onClose, products }: FilterPanelProps) => {
  const [selected, setSelected] = useState<Record<string, string[]>>(filters);

  useEffect(() => {
    setSelected(filters);
  }, [filters]);

  const selectedCategories = selected['Category'] || [];

  // Derive brand list based on selected category
  const dynamicBrands = Array.from(
    new Set(
      products
        .filter((product) =>
          selectedCategories.length === 0 || selectedCategories.includes(product.category)
        )
        .map((p) => p.brand)
        .filter(Boolean)
    )
  );

  const toggleCheckbox = (section: string, value: string) => {
    const current = selected[section] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    setSelected({ ...selected, [section]: updated });
  };

  const clearFilters = () => {
    setSelected({});
    onFilterChange({});
    onClose();
  };

  const applyFilters = () => {
    onFilterChange(selected);
    onClose();
  };

  const renderCheckboxes = (section: string, options: string[]) => (
    <div className="mb-4">
      <h4 className="font-semibold text-md mb-2">{section}</h4>
      <div className="space-y-1">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selected[section]?.includes(option) || false}
              onChange={() => toggleCheckbox(section, option)}
              className="form-checkbox text-green-600"
            />
            <span>{option}</span>
          </label>
        ))}
        {options.length === 0 && <p className="text-sm text-gray-500">No options available</p>}
      </div>
    </div>
  );

  const isAnyFilterSelected = Object.values(selected).some((arr) => arr.length > 0);

  return (
    <div className="space-y-6">
      {renderCheckboxes('Category', categoryOptions)}
      {renderCheckboxes('Brand', dynamicBrands)}

      <div className="flex justify-between mt-6">
        {isAnyFilterSelected && (
          <button
            onClick={clearFilters}
            className="text-sm px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
          >
            Clear Filters
          </button>
        )}
        <button
          onClick={applyFilters}
          className="text-sm px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
