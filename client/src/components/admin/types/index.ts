export interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  services: string[];
  serviceAreas: string[];
  availability: {
    [key: string]: {
      isAvailable: boolean;
      startTime: string;
      endTime: string;
    };
  };
  certifications: string[];
  profileImage?: string;
  rating: number;
  completedJobs: number;
  joinedDate: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customer: Customer;
  serviceType: string;
  description: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  location: {
    address: string;
    city: string;
    zipCode: string;
  };
  specialInstructions?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface Earnings {
  id: string;
  bookingId: string;
  amount: number;
  date: string;
  status: 'pending' | 'paid' | 'processing';
  paymentMethod: string;
}

export interface Notification {
  id: string;
  type: 'new_booking' | 'booking_change' | 'payment' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalBookings: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  pendingRequests: number;
  acceptedJobs: number;
  earnings: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    total: number;
  };
  completedJobs: number;
  averageRating: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  booking: Booking;
  color?: string;
} 