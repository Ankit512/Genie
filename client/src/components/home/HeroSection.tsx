import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ServiceCategory } from '../../types/service';

const FEATURED_CATEGORIES: Array<{
  id: ServiceCategory;
  name: string;
  icon: string;
  description: string;
  startingPrice: number;
}> = [
  {
    id: 'cleaning',
    name: 'Home Cleaning',
    icon: '🧹',
    description: 'Professional home cleaning services',
    startingPrice: 25
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    icon: '🔧',
    description: 'Expert plumbing repairs & installation',
    startingPrice: 45
  },
  {
    id: 'electrical',
    name: 'Electrical',
    icon: '⚡',
    description: 'Electrical repairs & maintenance',
    startingPrice: 50
  },
  {
    id: 'appliance_repair',
    name: 'Appliance Repair',
    icon: '🔨',
    description: 'All appliance repair services',
    startingPrice: 35
  },
  {
    id: 'painting',
    name: 'Painting',
    icon: '🎨',
    description: 'Professional painting services',
    startingPrice: 30
  },
  {
    id: 'pest_control',
    name: 'Pest Control',
    icon: '🐜',
    description: 'Complete pest control solutions',
    startingPrice: 40
  }
];

export function HeroSection() {
  const navigate = useNavigate();
  const [postcode, setPostcode] = useState('');
  const [showPostcodeResults, setShowPostcodeResults] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    navigate(`/customer/services?search=${encodeURIComponent(query)}`);
  };

  const handlePostcodeCheck = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (postcode.length >= 3) {
      setShowPostcodeResults(true);
      setTimeout(() => setShowPostcodeResults(false), 3000);
    }
  };

  const handleCategoryClick = (category: ServiceCategory) => {
    navigate(`/customer/services?category=${category}`);
  };

  const handleQuickBook = () => {
    navigate('/customer/services');
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 min-h-screen">
      {/* Background Video/Pattern */}
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-12 md:pt-32 md:pb-20">
          <div className="text-center">
            {/* Urgency Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/20 text-green-100 text-sm font-medium mb-8 border border-green-500/30">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Available Today • Same-Day Service
            </div>

            <h1 className="text-5xl tracking-tight font-extrabold text-white sm:text-6xl md:text-7xl lg:text-8xl">
              <span className="block">Book in</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                60 Seconds
              </span>
            </h1>
            
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-100 sm:text-2xl md:mt-8">
              Trusted local service professionals for all your home needs
            </p>

            {/* Price Transparency */}
            <div className="mt-8 text-center">
              <p className="text-2xl font-bold text-white">
                Starting from <span className="text-yellow-400">€25</span>
              </p>
              <p className="text-sm text-gray-300 mt-2">
                No hidden fees • Transparent pricing • Instant quotes
              </p>
            </div>

            {/* Main Search Bar */}
            <div className="mt-12 max-w-2xl mx-auto">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <input
                    type="text"
                    name="search"
                    className="block w-full px-6 py-4 text-lg rounded-2xl border-0 bg-white/95 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-blue-300/50 shadow-2xl"
                    placeholder="What service do you need? (e.g. 'plumbing repair')"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 px-8 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300/50 transition-all transform hover:scale-105"
                  >
                    Book Now
                  </button>
                </div>
              </form>
            </div>

            {/* Postcode Checker */}
            <div className="mt-8 max-w-md mx-auto">
              <form onSubmit={handlePostcodeCheck} className="flex">
                <input
                  type="text"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-l-xl border-0 bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Enter your postcode"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-white/20 text-white rounded-r-xl hover:bg-white/30 transition-colors border border-white/30"
                >
                  Check
                </button>
              </form>
              {showPostcodeResults && (
                <div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-100">
                  <p className="text-sm">✓ Great news! We have 12 professionals available in your area</p>
                </div>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleQuickBook}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all shadow-lg"
              >
                Book in 60 Seconds
              </button>
              <button
                onClick={() => navigate('/services')}
                className="px-8 py-4 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 backdrop-blur-sm border border-white/30 transition-all"
              >
                Browse Services
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-300">
              <div className="flex items-center">
                <span className="text-yellow-400 mr-2">⭐</span>
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                <span>Verified Professionals</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-400 mr-2">🛡️</span>
                <span>Insured & Bonded</span>
              </div>
              <div className="flex items-center">
                <span className="text-purple-400 mr-2">⚡</span>
                <span>Same-Day Service</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Featured Categories */}
        <div className="relative bg-white/95 backdrop-blur-sm -mt-8 rounded-3xl shadow-2xl">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Popular Services
            </h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
              {FEATURED_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className="relative group bg-white p-6 focus:outline-none rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:shadow-lg transition-all transform hover:scale-105"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-4xl mb-3">{category.icon}</span>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {category.name}
                    </h3>
                    <p className="mt-2 text-xs text-blue-600 font-medium">
                      From €{category.startingPrice}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {category.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Call to Action Banner */}
            <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Need Help Right Now?
              </h3>
              <p className="text-blue-100 mb-6">
                Get instant quotes from verified professionals in your area
              </p>
              <button
                onClick={handleQuickBook}
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transform hover:scale-105 transition-all"
              >
                Get Instant Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 