import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuthContext } from '../../contexts/AuthContext';
import type { Service } from '../../types/service';

interface BookingFormData {
  date: string;
  time: string;
  notes: string;
}

export function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState<BookingFormData>({
    date: '',
    time: '',
    notes: '',
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const loadService = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, 'services', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setService({ id: docSnap.id, ...docSnap.data() } as Service);
        } else {
          setError('Service not found');
        }
      } catch (err: any) {
        console.error('Error loading service:', err);
        setError('Failed to load service details');
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !service) return;

    setBookingLoading(true);
    setBookingError('');
    setBookingSuccess(false);

    try {
      // Create booking record
      const booking = {
        serviceId: service.id,
        providerId: service.providerId,
        customerId: user.uid,
        customerName: user.displayName,
        serviceName: service.title,
        date: bookingData.date,
        time: bookingData.time,
        notes: bookingData.notes,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'bookings'), booking);
      setBookingSuccess(true);

      // Reset form
      setBookingData({
        date: '',
        time: '',
        notes: '',
      });

      // Redirect to bookings page after a delay
      setTimeout(() => {
        navigate('/customer/bookings');
      }, 2000);
    } catch (err: any) {
      console.error('Error creating booking:', err);
      setBookingError('Failed to create booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading service details...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-8 bg-red-100 text-red-700 rounded-lg">
          {error || 'Service not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Service Details */}
        <div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {service.images[0] && (
              <img
                src={service.images[0]}
                alt={service.title}
                className="w-full h-64 object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex items-start justify-between">
                <h1 className="text-2xl font-bold text-foreground">{service.title}</h1>
                <div className="flex items-center">
                  {service.rating && (
                    <>
                      <span className="text-yellow-400 text-xl">★</span>
                      <span className="ml-1 text-gray-600">{service.rating.toFixed(1)}</span>
                      {service.reviewCount && (
                        <span className="ml-1 text-gray-500">({service.reviewCount})</span>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize">
                  {service.category.replace('_', ' ')}
                </span>
                <span className="ml-4 text-lg font-semibold">
                  ${service.price.amount}/{service.price.unit}
                </span>
              </div>

              <p className="mt-4 text-gray-600">{service.description}</p>

              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Location</h3>
                  <p className="text-gray-600">
                    {service.location.address}
                    <br />
                    {service.location.city}, {service.location.state} {service.location.zipCode}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Availability</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {service.availability.days.map((day) => (
                      <span
                        key={day}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm capitalize"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-gray-600">
                    {service.availability.startTime} - {service.availability.endTime}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Book this Service</h2>

          {bookingSuccess ? (
            <div className="p-4 bg-green-100 text-green-700 rounded-md">
              Booking created successfully! Redirecting to your bookings...
            </div>
          ) : (
            <form onSubmit={handleBooking} className="space-y-6">
              {bookingError && (
                <div className="p-4 bg-red-100 text-red-700 rounded-md">
                  {bookingError}
                </div>
              )}

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={bookingData.date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={bookingData.time}
                  onChange={handleInputChange}
                  min={service.availability.startTime}
                  max={service.availability.endTime}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={bookingData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Any special requirements or instructions..."
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                className={`w-full py-2 px-4 rounded-md ${
                  bookingLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {bookingLoading ? 'Creating Booking...' : 'Book Now'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 