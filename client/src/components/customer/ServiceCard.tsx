import { Link } from 'react-router-dom';
import type { Service } from '../../types/service';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        {service.images[0] ? (
          <img
            src={service.images[0]}
            alt={service.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 bg-blue-500 text-white text-sm rounded-full">
            ${service.price.amount}/{service.price.unit}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
          {service.rating && (
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="ml-1 text-sm text-gray-600">
                {service.rating.toFixed(1)}
              </span>
              {service.reviewCount && (
                <span className="ml-1 text-sm text-gray-500">
                  ({service.reviewCount})
                </span>
              )}
            </div>
          )}
        </div>

        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
          {service.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="ml-2 text-sm text-gray-500">
              {service.location.city}, {service.location.state}
            </span>
          </div>

          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full capitalize">
            {service.category.replace('_', ' ')}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Available: {service.availability.days.length} days/week
          </div>
          <Link
            to={`/customer/services/${service.id}`}
            className="text-blue-500 hover:text-blue-600 font-medium text-sm"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
} 