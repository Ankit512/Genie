import { 
  Professional, 
  Booking, 
  Earnings, 
  Notification, 
  DashboardStats, 
  CalendarEvent 
} from '../types';

// Mock data - in real app, this would come from your backend
const mockProfessional: Professional = {
  id: 'prof-1',
  name: 'John Smith',
  email: 'john.smith@example.com',
  phone: '+353 87 123 4567',
  bio: 'Professional plumber with 10+ years experience. Specializing in emergency repairs and installations.',
  services: ['Plumbing', 'Emergency Repairs', 'Installation'],
  serviceAreas: ['Dublin', 'Cork', 'Galway'],
  availability: {
    monday: { isAvailable: true, startTime: '08:00', endTime: '18:00' },
    tuesday: { isAvailable: true, startTime: '08:00', endTime: '18:00' },
    wednesday: { isAvailable: true, startTime: '08:00', endTime: '18:00' },
    thursday: { isAvailable: true, startTime: '08:00', endTime: '18:00' },
    friday: { isAvailable: true, startTime: '08:00', endTime: '18:00' },
    saturday: { isAvailable: true, startTime: '09:00', endTime: '15:00' },
    sunday: { isAvailable: false, startTime: '', endTime: '' }
  },
  certifications: ['Licensed Plumber', 'Gas Safety Certificate'],
  rating: 4.8,
  completedJobs: 156,
  joinedDate: '2022-01-15'
};

const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    customerId: 'cust-1',
    customer: {
      id: 'cust-1',
      name: 'Mary O\'Connor',
      email: 'mary.oconnor@email.com',
      phone: '+353 86 987 6543',
      address: '123 Main Street, Dublin 2'
    },
    serviceType: 'Emergency Plumbing',
    description: 'Burst pipe in kitchen - urgent repair needed',
    scheduledDate: '2024-01-20',
    scheduledTime: '10:00',
    duration: 2,
    location: {
      address: '123 Main Street',
      city: 'Dublin 2',
      zipCode: 'D02 XY12'
    },
    specialInstructions: 'Ring doorbell twice. Dog is friendly.',
    status: 'pending',
    price: 120,
    createdAt: '2024-01-19T14:30:00Z',
    updatedAt: '2024-01-19T14:30:00Z'
  },
  {
    id: 'booking-2',
    customerId: 'cust-2',
    customer: {
      id: 'cust-2',
      name: 'Patrick Murphy',
      email: 'patrick.murphy@email.com',
      phone: '+353 87 654 3210',
      address: '456 Oak Avenue, Cork'
    },
    serviceType: 'Bathroom Installation',
    description: 'Install new bathroom suite',
    scheduledDate: '2024-01-22',
    scheduledTime: '09:00',
    duration: 6,
    location: {
      address: '456 Oak Avenue',
      city: 'Cork',
      zipCode: 'T12 ABC3'
    },
    status: 'accepted',
    price: 450,
    createdAt: '2024-01-18T10:15:00Z',
    updatedAt: '2024-01-19T09:20:00Z'
  },
  {
    id: 'booking-3',
    customerId: 'cust-3',
    customer: {
      id: 'cust-3',
      name: 'Sarah Kelly',
      email: 'sarah.kelly@email.com',
      phone: '+353 85 123 9876',
      address: '789 River Road, Galway'
    },
    serviceType: 'Leak Repair',
    description: 'Small leak under kitchen sink',
    scheduledDate: '2024-01-18',
    scheduledTime: '14:00',
    duration: 1,
    location: {
      address: '789 River Road',
      city: 'Galway',
      zipCode: 'H91 DEF4'
    },
    status: 'completed',
    price: 75,
    createdAt: '2024-01-17T16:45:00Z',
    updatedAt: '2024-01-18T15:30:00Z'
  }
];

const mockEarnings: Earnings[] = [
  {
    id: 'earn-1',
    bookingId: 'booking-3',
    amount: 75,
    date: '2024-01-18',
    status: 'paid',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'earn-2',
    bookingId: 'booking-2',
    amount: 450,
    date: '2024-01-22',
    status: 'pending',
    paymentMethod: 'Credit Card'
  }
];

const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'new_booking',
    title: 'New Booking Request',
    message: 'Mary O\'Connor has requested emergency plumbing service',
    isRead: false,
    createdAt: '2024-01-19T14:30:00Z'
  },
  {
    id: 'notif-2',
    type: 'payment',
    title: 'Payment Received',
    message: 'Payment of €75 has been processed for job #booking-3',
    isRead: true,
    createdAt: '2024-01-18T15:45:00Z'
  }
];

// Mock API service - replace with real API calls
export class MockDataService {
  // Dashboard
  static async getDashboardStats(): Promise<DashboardStats> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          totalBookings: {
            today: 1,
            thisWeek: 3,
            thisMonth: 8
          },
          pendingRequests: 1,
          acceptedJobs: 1,
          earnings: {
            today: 0,
            thisWeek: 525,
            thisMonth: 1450,
            total: 12750
          },
          completedJobs: 156,
          averageRating: 4.8
        });
      }, 500);
    });
  }

  // Professional Profile
  static async getProfessionalProfile(): Promise<Professional> {
    return new Promise(resolve => {
      setTimeout(() => resolve(mockProfessional), 300);
    });
  }

  static async updateProfessionalProfile(updates: Partial<Professional>): Promise<Professional> {
    return new Promise(resolve => {
      setTimeout(() => {
        const updated = { ...mockProfessional, ...updates };
        resolve(updated);
      }, 500);
    });
  }

  // Bookings
  static async getBookings(status?: string): Promise<Booking[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        if (status) {
          resolve(mockBookings.filter(booking => booking.status === status));
        } else {
          resolve(mockBookings);
        }
      }, 400);
    });
  }

  static async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<Booking> {
    return new Promise(resolve => {
      setTimeout(() => {
        const booking = mockBookings.find(b => b.id === bookingId);
        if (booking) {
          booking.status = status;
          booking.updatedAt = new Date().toISOString();
        }
        resolve(booking!);
      }, 500);
    });
  }

  // Earnings
  static async getEarnings(startDate?: string, endDate?: string): Promise<Earnings[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        let filtered = mockEarnings;
        if (startDate && endDate) {
          filtered = mockEarnings.filter(earning => 
            earning.date >= startDate && earning.date <= endDate
          );
        }
        resolve(filtered);
      }, 400);
    });
  }

  // Notifications
  static async getNotifications(): Promise<Notification[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(mockNotifications), 300);
    });
  }

  static async markNotificationAsRead(notificationId: string): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        const notification = mockNotifications.find(n => n.id === notificationId);
        if (notification) {
          notification.isRead = true;
        }
        resolve();
      }, 200);
    });
  }

  // Calendar Events
  static async getCalendarEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        const events = mockBookings
          .filter(booking => booking.status === 'accepted' || booking.status === 'completed')
          .map(booking => ({
            id: booking.id,
            title: `${booking.serviceType} - ${booking.customer.name}`,
            start: new Date(`${booking.scheduledDate}T${booking.scheduledTime}`),
            end: new Date(`${booking.scheduledDate}T${booking.scheduledTime}`),
            booking,
            color: booking.status === 'completed' ? '#10b981' : '#3b82f6'
          }));
        resolve(events);
      }, 400);
    });
  }
} 