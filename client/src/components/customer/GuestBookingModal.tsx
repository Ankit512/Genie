import React, { useState } from 'react';
import type { Service } from '../../types/service';

interface GuestBookingModalProps {
  service: Service;
  isOpen: boolean;
  onClose: () => void;
  onBooking: (bookingData: any) => void;
}

interface GuestBookingData {
  name: string;
  email: string;
  phone: string;
  address: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  hours: number;
}

export function GuestBookingModal({ service, isOpen, onClose, onBooking }: GuestBookingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<GuestBookingData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    preferredDate: '',
    preferredTime: '',
    notes: '',
    hours: 1
  });

  const totalSteps = 3;

  const handleInputChange = (field: keyof GuestBookingData, value: string | number) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotal = () => {
    if (service.price.unit === 'hour') {
      return service.price.amount * bookingData.hours;
    }
    return service.price.amount;
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBooking = () => {
    onBooking({
      ...bookingData,
      service: service,
      total: calculateTotal()
    });
    onClose();
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Your Information';
      case 2: return 'Service Details';
      case 3: return 'Confirm Booking';
      default: return 'Booking';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Quick Booking</h2>
              <p className="text-blue-100">No account required • Book in 60 seconds</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Progress Indicator */}
          <div className="mt-6">
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-100">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-blue-100">{getStepTitle()}</span>
            </div>
            <div className="mt-2 bg-blue-400/30 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Service Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-900">{service.title}</h3>
                <p className="text-sm text-gray-600">{service.category.replace('_', ' ')}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">€{calculateTotal()}</p>
                {service.price.unit === 'hour' && (
                  <p className="text-sm text-gray-600">{bookingData.hours} hour{bookingData.hours > 1 ? 's' : ''}</p>
                )}
              </div>
            </div>
          </div>

          {/* Step Content */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={bookingData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={bookingData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Address *
                </label>
                <input
                  type="text"
                  value={bookingData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the service address"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  value={bookingData.preferredDate}
                  onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time *
                </label>
                <input
                  type="time"
                  value={bookingData.preferredTime}
                  onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {service.price.unit === 'hour' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Hours
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleInputChange('hours', Math.max(1, bookingData.hours - 1))}
                      className="w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-xl font-semibold">{bookingData.hours}</span>
                    <button
                      onClick={() => handleInputChange('hours', bookingData.hours + 1)}
                      className="w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Notes
                </label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any special requirements or notes..."
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span className="font-medium">{service.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date & Time:</span>
                    <span className="font-medium">{bookingData.preferredDate} at {bookingData.preferredTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span className="font-medium">{bookingData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contact:</span>
                    <span className="font-medium">{bookingData.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Address:</span>
                    <span className="font-medium">{bookingData.address}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-blue-600">€{calculateTotal()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-green-800 font-medium">No upfront payment required</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Pay directly to the service professional after the work is completed.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-6 rounded-b-2xl">
          <div className="flex justify-between">
            <button
              onClick={currentStep === 1 ? onClose : handlePrevStep}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </button>
            
            {currentStep < totalSteps ? (
              <button
                onClick={handleNextStep}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleBooking}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Confirm Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 