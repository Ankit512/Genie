import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { ServiceCategory } from '../../types/service';

const FEATURED_CATEGORIES: Array<{
  id: ServiceCategory;
  name: string;
  icon: string;
  description: string;
}> = [
  {
    id: 'cleaning',
    name: 'Home Cleaning',
    icon: '🧹',
    description: 'Professional home cleaning services'
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    icon: '🔧',
    description: 'Expert plumbing repairs & installation'
  },
  {
    id: 'electrical',
    name: 'Electrical',
    icon: '⚡',
    description: 'Electrical repairs & maintenance'
  },
  {
    id: 'appliance_repair',
    name: 'Appliance Repair',
    icon: '🔨',
    description: 'All appliance repair services'
  },
  {
    id: 'painting',
    name: 'Painting',
    icon: '🎨',
    description: 'Professional painting services'
  },
  {
    id: 'pest_control',
    name: 'Pest Control',
    icon: '🐜',
    description: 'Complete pest control solutions'
  }
];

export function HeroSection() {
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    navigate(`/customer/services?search=${encodeURIComponent(query)}`);
  };

  const handleCategoryClick = (category: ServiceCategory) => {
    navigate(`/customer/services?category=${category}`);
  };

  return (
    <div className="relative bg-white">
      {/* Hero Background */}
      <div className="absolute inset-0 h-[500px] bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </div>

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block">Home Services,</span>
              <span className="block text-blue-200">On Demand</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Book trusted local service professionals for all your home needs
            </p>

            {/* Search Bar */}
            <div className="mt-10 max-w-xl mx-auto">
              <form onSubmit={handleSearch} className="sm:flex">
                <div className="min-w-0 flex-1">
                  <input
                    type="text"
                    name="search"
                    className="block w-full px-4 py-3 rounded-lg text-base border-0 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Search for any service..."
                  />
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <button
                    type="submit"
                    className="block w-full py-3 px-6 rounded-lg text-base font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Featured Categories */}
        <div className="relative bg-white -mt-8 rounded-t-3xl">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Popular Services
            </h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
              {FEATURED_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className="relative group bg-white p-6 focus:outline-none rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-4xl mb-3">{category.icon}</span>
                    <h3 className="text-sm font-medium text-gray-900">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500 text-center hidden group-hover:block">
                      {category.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 