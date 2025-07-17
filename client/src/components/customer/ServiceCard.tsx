import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Service } from '../../types/service';

interface ServiceCardProps {
  service: Service;
  showQuickBook?: boolean;
  onQuickBook?: () => void;
}

const getCategoryIcon = (category: string) => {
  const icons: { [key: string]: string } = {
    'cleaning': '🧹',
    'plumbing': '🔧',
    'electrical': '⚡',
    'landscaping': '🌿',
    'painting': '🎨',
    'carpentry': '🔨',
    'appliance_repair': '⚙️',
    'hvac': '🌡️',
    'pest_control': '🐜',
    'moving': '📦',
    'other': '🔧'
  };
  return icons[category] || '🔧';
};

export function ServiceCard({ service, showQuickBook = false, onQuickBook }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedHours, setSelectedHours] = useState(1);

  const calculatePrice = (hours: number) => {
    if (service.price.unit === 'hour') {
      return service.price.amount * hours;
    }
    return service.price.amount;
  };

  const handleQuickBook = () => {
    if (onQuickBook) {
      onQuickBook();
    } else {
      // Quick booking logic would go here
      console.log('Quick booking for:', service.id);
    }
  };

  const handleCalendarToggle = () => {
    setShowCalendar(!showCalendar);
  };

  const getAvailabilityText = () => {
    if (service.availability.days.length === 7) {
      return "Available 7 days/week";
    } else if (service.availability.days.length >= 5) {
      return "Available weekdays";
    } else {
      return `Available ${service.availability.days.length} days/week`;
    }
  };

  const todayAvailable = service.availability.days.includes(new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase().slice(0, 3));

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 group">
        {/* Image Placeholder */}
        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-2">{getCategoryIcon(service.category)}</div>
            <div className="text-sm text-gray-600 capitalize font-medium">
              {service.category.replace('_', ' ')}
            </div>
          </div>
        </div>
        
        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg">
            <span className="text-lg font-bold text-blue-600">
              €{service.price.amount}
            </span>
            <span className="text-sm text-gray-600">
              /{service.price.unit}
            </span>
          </div>
        </div>

        {/* Availability Badge */}
        {todayAvailable && (
          <div className="absolute top-3 left-3">
            <div className="bg-green-500 text-white rounded-full px-3 py-1 text-xs font-medium flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
              Available Today
            </div>
          </div>
        )}

        {/* Quick Actions Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleCalendarToggle}
              className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg mr-2 hover:bg-white/30 transition-colors"
            >
              📅 View Calendar
            </button>
            <button
              onClick={handleQuickBook}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Quick Book
            </button>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
            {service.title}
          </h3>
          {service.rating && (
            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
              <span className="text-yellow-500 text-sm">⭐</span>
              <span className="ml-1 text-sm font-medium text-gray-700">
                {service.rating.toFixed(1)}
              </span>
              {service.reviewCount && (
                <span className="ml-1 text-xs text-gray-500">
                  ({service.reviewCount})
                </span>
              )}
            </div>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* Location and Category */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-gray-500">
            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm">
              {service.location.city}, {service.location.state}
            </span>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium capitalize">
            {service.category.replace('_', ' ')}
          </span>
        </div>

        {/* Availability Info */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{getAvailabilityText()}</span>
          <span className="ml-2 text-gray-400">•</span>
          <span className="ml-2">{service.availability.startTime} - {service.availability.endTime}</span>
        </div>

        {/* Price Calculator */}
        {service.price.unit === 'hour' && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Price Calculator</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => setSelectedHours(Math.max(1, selectedHours - 1))}
                  className="w-8 h-8 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                >
                  -
                </button>
                <span className="mx-4 font-medium">{selectedHours} hour{selectedHours > 1 ? 's' : ''}</span>
                <button
                  onClick={() => setSelectedHours(selectedHours + 1)}
                  className="w-8 h-8 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                >
                  +
                </button>
              </div>
              <span className="text-lg font-bold text-blue-600">
                €{calculatePrice(selectedHours)}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link
            to={`/customer/services/${service.id}`}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl text-center font-medium hover:bg-gray-200 transition-colors"
          >
            View Details
          </Link>
          {showQuickBook && (
            <button
              onClick={handleQuickBook}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
            >
              Book Now
            </button>
          )}
        </div>

        {/* Instant Quote Button */}
        <button className="w-full mt-3 bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors border border-green-200">
          Get Instant Quote
        </button>
      </div>

      {/* Calendar Preview Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleCalendarToggle}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Available Times</h3>
              <button
                onClick={handleCalendarToggle}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
              {Array.from({ length: 14 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
                const isAvailable = service.availability.days.includes(dayName);
                
                return (
                  <button
                    key={i}
                    className={`p-2 text-sm rounded-lg ${
                      isAvailable 
                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!isAvailable}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCalendarToggle}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleCalendarToggle();
                  handleQuickBook();
                }}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Book Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 