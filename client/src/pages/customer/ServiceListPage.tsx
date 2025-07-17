import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, Query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ServiceSearch, type ServiceFilters } from '../../components/customer/ServiceSearch';
import { ServiceCard } from '../../components/customer/ServiceCard';
import type { Service } from '../../types/service';

export function ServiceListPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchServices = async (filters: ServiceFilters) => {
    setLoading(true);
    setError('');

    try {
      let q = collection(db, 'services') as Query;

      // Apply filters
      if (filters.category) {
        q = query(q, where('category', '==', filters.category));
      }

      if (filters.location) {
        // Simple city/state match - could be enhanced with proper geocoding
        q = query(
          q,
          where('location.city', '==', filters.location.toLowerCase()) ||
          where('location.state', '==', filters.location.toLowerCase())
        );
      }

      // Price range filter
      q = query(
        q,
        where('price.amount', '>=', filters.priceRange.min),
        where('price.amount', '<=', filters.priceRange.max)
      );

      // Add sorting
      q = query(q, orderBy('rating', 'desc'));

      const snapshot = await getDocs(q);
      const serviceList: Service[] = [];

      snapshot.forEach((doc) => {
        const service = { id: doc.id, ...doc.data() } as Service;

        // Apply text search filter client-side
        if (filters.query) {
          const searchText = filters.query.toLowerCase();
          const matchesSearch =
            service.title.toLowerCase().includes(searchText) ||
            service.description.toLowerCase().includes(searchText);

          if (matchesSearch) {
            serviceList.push(service);
          }
        } else {
          serviceList.push(service);
        }
      });

      setServices(serviceList);
    } catch (err: any) {
      console.error('Error searching services:', err);
      setError('Failed to load services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    searchServices({
      query: '',
      category: '',
      priceRange: { min: 0, max: 1000 },
      location: '',
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Find Services</h1>

      <div className="mb-8">
        <ServiceSearch onSearch={searchServices} />
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No services found matching your criteria.</p>
          <p className="mt-2 text-gray-500">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
} 