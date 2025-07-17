import { useState, useEffect } from 'react';
import { ServiceSearch, type ServiceFilters } from '../../components/customer/ServiceSearch';
import { ServiceCard } from '../../components/customer/ServiceCard';
import { GuestBookingModal } from '../../components/customer/GuestBookingModal';
import type { Service } from '../../types/service';

// Sample services data for demonstration
const SAMPLE_SERVICES: Service[] = [
  {
    id: '1',
    providerId: 'provider1',
    title: 'Professional House Cleaning',
    description: 'Complete house cleaning service including all rooms, kitchen, and bathrooms. Experienced cleaners with eco-friendly products.',
    category: 'cleaning',
    price: { amount: 25, unit: 'hour' },
    availability: {
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      startTime: '08:00',
      endTime: '18:00'
    },
    location: {
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001'
    },
    images: ['/api/placeholder/300/200'],
    rating: 4.8,
    reviewCount: 127,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    providerId: 'provider2',
    title: 'Emergency Plumbing Repair',
    description: 'Fast and reliable plumbing services. Available 24/7 for emergencies. Licensed and insured plumbers.',
    category: 'plumbing',
    price: { amount: 45, unit: 'hour' },
    availability: {
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      startTime: '00:00',
      endTime: '23:59'
    },
    location: {
      address: '456 Oak Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10002'
    },
    images: ['/api/placeholder/300/200'],
    rating: 4.9,
    reviewCount: 89,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    providerId: 'provider3',
    title: 'Electrical Installation & Repair',
    description: 'Professional electrical services for your home. Licensed electricians for all your electrical needs.',
    category: 'electrical',
    price: { amount: 50, unit: 'hour' },
    availability: {
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      startTime: '08:00',
      endTime: '17:00'
    },
    location: {
      address: '789 Pine St',
      city: 'New York',
      state: 'NY',
      zipCode: '10003'
    },
    images: ['/api/placeholder/300/200'],
    rating: 4.7,
    reviewCount: 156,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    providerId: 'provider4',
    title: 'Interior & Exterior Painting',
    description: 'Professional painting services for residential and commercial properties. Quality work guaranteed.',
    category: 'painting',
    price: { amount: 30, unit: 'hour' },
    availability: {
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      startTime: '07:00',
      endTime: '19:00'
    },
    location: {
      address: '321 Elm St',
      city: 'New York',
      state: 'NY',
      zipCode: '10004'
    },
    images: ['/api/placeholder/300/200'],
    rating: 4.6,
    reviewCount: 203,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    providerId: 'provider5',
    title: 'Appliance Repair Service',
    description: 'Expert repair services for all major appliances. Washers, dryers, refrigerators, and more.',
    category: 'appliance_repair',
    price: { amount: 35, unit: 'job' },
    availability: {
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      startTime: '08:00',
      endTime: '18:00'
    },
    location: {
      address: '654 Maple Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10005'
    },
    images: ['/api/placeholder/300/200'],
    rating: 4.5,
    reviewCount: 98,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '6',
    providerId: 'provider6',
    title: 'Pest Control Treatment',
    description: 'Comprehensive pest control solutions for your home. Safe and effective treatments.',
    category: 'pest_control',
    price: { amount: 80, unit: 'job' },
    availability: {
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      startTime: '08:00',
      endTime: '16:00'
    },
    location: {
      address: '987 Cedar Ln',
      city: 'New York',
      state: 'NY',
      zipCode: '10006'
    },
    images: ['/api/placeholder/300/200'],
    rating: 4.8,
    reviewCount: 67,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export function ServiceListPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showGuestBooking, setShowGuestBooking] = useState(false);

  const searchServices = async (filters: ServiceFilters) => {
    setLoading(true);
    setError('');

    try {
      // For demonstration, we'll use sample data instead of Firebase
      // Comment out the Firebase code and use sample data
      /*
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
      */

      // Use sample data with client-side filtering
      let filteredServices = SAMPLE_SERVICES;

      // Apply filters
      if (filters.category) {
        filteredServices = filteredServices.filter(service => 
          service.category === filters.category
        );
      }

      if (filters.location) {
        filteredServices = filteredServices.filter(service => 
          service.location.city.toLowerCase().includes(filters.location.toLowerCase()) ||
          service.location.state.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      // Price range filter
      filteredServices = filteredServices.filter(service => 
        service.price.amount >= filters.priceRange.min && 
        service.price.amount <= filters.priceRange.max
      );

      // Apply text search filter
      if (filters.query) {
        const searchText = filters.query.toLowerCase();
        filteredServices = filteredServices.filter(service =>
          service.title.toLowerCase().includes(searchText) ||
          service.description.toLowerCase().includes(searchText)
        );
      }

      // Sort by rating
      filteredServices.sort((a, b) => (b.rating || 0) - (a.rating || 0));

      setServices(filteredServices);
    } catch (err: any) {
      console.error('Error searching services:', err);
      setError('Failed to load services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestBooking = (bookingData: any) => {
    console.log('Guest booking data:', bookingData);
    // Here you would typically send the booking data to your API
    // For now, we'll just show a success message
    alert('🎉 Booking request submitted successfully!\n\nWe\'ll contact you shortly to confirm the details and arrange payment.');
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
      {/* Header with instant booking banner */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Find Services</h1>
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Book in 60 Seconds</h2>
              <p className="text-green-100">No account required • Instant quotes • Same-day service available</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold">€25</div>
                <div className="text-sm text-green-100">Starting from</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">4.9★</div>
                <div className="text-sm text-green-100">Average rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">1000+</div>
                <div className="text-sm text-green-100">Happy customers</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <ServiceSearch onSearch={searchServices} />
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading services...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <p className="text-muted-foreground">No services found matching your criteria.</p>
          <p className="mt-2 text-muted-foreground">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <>
          {/* Service count and sorting options */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">
              Found {services.length} service{services.length !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select className="border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground">
                <option value="rating">Best Rating</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="availability">Availability</option>
              </select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                showQuickBook={true}
                onQuickBook={() => {
                  setSelectedService(service);
                  setShowGuestBooking(true);
                }}
              />
            ))}
          </div>

          {/* Load More Button */}
          {services.length > 0 && (
            <div className="text-center mt-12">
              <button className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Load More Services
              </button>
            </div>
          )}
        </>
      )}

      {/* Guest Booking Modal */}
      {selectedService && (
        <GuestBookingModal
          service={selectedService}
          isOpen={showGuestBooking}
          onClose={() => {
            setShowGuestBooking(false);
            setSelectedService(null);
          }}
          onBooking={handleGuestBooking}
        />
      )}
    </div>
  );
} 