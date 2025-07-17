import React, { useState } from 'react';
import type { ServiceCategory } from '../../types/service';

interface ServiceSearchProps {
  onSearch: (filters: ServiceFilters) => void;
}

export interface ServiceFilters {
  query: string;
  category: ServiceCategory | '';
  priceRange: {
    min: number;
    max: number;
  };
  location: string;
}

const SERVICE_CATEGORIES: ServiceCategory[] = [
  'cleaning',
  'plumbing',
  'electrical',
  'landscaping',
  'painting',
  'carpentry',
  'appliance_repair',
  'hvac',
  'pest_control',
  'moving',
  'other',
];

export function ServiceSearch({ onSearch }: ServiceSearchProps) {
  const [filters, setFilters] = useState<ServiceFilters>({
    query: '',
    category: '',
    priceRange: {
      min: 0,
      max: 1000,
    },
    location: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'min' || name === 'max') {
      setFilters((prev) => ({
        ...prev,
        priceRange: {
          ...prev.priceRange,
          [name]: Number(value),
        },
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            id="query"
            name="query"
            value={filters.query}
            onChange={handleInputChange}
            placeholder="Search services..."
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {SERVICE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={filters.location}
            onChange={handleInputChange}
            placeholder="Enter ZIP code or city"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price Range
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              name="min"
              value={filters.priceRange.min}
              onChange={handleInputChange}
              placeholder="Min"
              min={0}
              className="w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="max"
              value={filters.priceRange.max}
              onChange={handleInputChange}
              placeholder="Max"
              min={0}
              className="w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
      </div>
    </form>
  );
} 