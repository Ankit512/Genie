# Admin Dashboard for Genie - Home Services Platform

A comprehensive admin dashboard for service professionals to manage their workflow, bookings, and business operations.

## 🏗️ Architecture

The admin dashboard follows a clean architecture with clear separation of concerns:

```
admin/
├── types/                    # TypeScript interfaces
├── services/                 # Data layer (mock service)
├── components/               # UI components
│   ├── DashboardOverview.tsx
│   ├── BookingsManagement.tsx
│   ├── CalendarView.tsx
│   ├── EarningsPayments.tsx
│   └── ProfileManagement.tsx
├── AdminDashboard.tsx        # Main layout component
└── index.ts                  # Exports
```

## 🎯 Key Features

### Dashboard Overview
- **Summary Statistics**: Total bookings, pending requests, earnings
- **Performance Metrics**: Completion rate, average rating
- **Quick Actions**: Easy access to common tasks
- **Recent Activity**: Latest notifications and updates

### Bookings Management
- **Booking Lifecycle**: View, accept, reject, and complete bookings
- **Customer Information**: Full customer details and contact info
- **Service Details**: Description, location, pricing, special instructions
- **Status Tracking**: Organized by status (pending, accepted, completed)
- **Quick Actions**: Call customer, send message, reschedule

### Calendar View
- **Monthly Calendar**: Visual representation of scheduled bookings
- **Event Details**: Click any date to view scheduled services
- **Color Coding**: Different colors for different booking statuses
- **Responsive Design**: Works on desktop and mobile

### Earnings & Payments
- **Income Tracking**: Total earnings, monthly/weekly breakdowns
- **Payment History**: Detailed transaction history with filters
- **Payout Management**: Request payouts, view payout settings
- **Financial Analytics**: Average per job, success rates

### Profile Management
- **Professional Details**: Edit name, contact info, bio
- **Service Offerings**: Manage services and service areas
- **Availability Schedule**: Set working hours for each day
- **Certifications**: Upload and manage professional certifications

## 🔧 Technical Implementation

### Data Layer Separation
The dashboard uses a mock data service that can be easily replaced with any backend:

```typescript
// Replace MockDataService with your actual API service
import { MockDataService } from './services/mockDataService';

// Easy to swap out:
const bookings = await MockDataService.getBookings();
// becomes:
const bookings = await YourAPIService.getBookings();
```

### TypeScript Interfaces
All data structures are properly typed for type safety:

```typescript
interface Booking {
  id: string;
  customerId: string;
  serviceType: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  // ... more properties
}
```

### Component Architecture
- **Modular Design**: Each major feature is a separate component
- **Reusable UI**: Uses shadcn/ui components for consistency
- **State Management**: Local state with React hooks
- **Loading States**: Proper loading and error handling

## 🎨 UI/UX Features

### Responsive Design
- **Mobile-First**: Fully responsive across all screen sizes
- **Touch-Friendly**: Optimized for mobile interactions
- **Sidebar Navigation**: Collapsible sidebar with mobile overlay

### Professional Styling
- **Modern Design**: Clean, professional appearance
- **Consistent Branding**: Matches Genie platform theme
- **Accessibility**: Proper contrast ratios and keyboard navigation
- **Loading States**: Skeleton loading for better UX

### Interactive Elements
- **Real-time Updates**: Status changes reflect immediately
- **Smooth Transitions**: Animated state changes
- **Hover Effects**: Interactive feedback for all clickable elements
- **Status Badges**: Visual indicators for booking statuses

## 🔌 Integration Guide

### Backend Integration
Replace the mock service with your actual API:

```typescript
// services/apiService.ts
export class APIService {
  static async getBookings(): Promise<Booking[]> {
    const response = await fetch('/api/bookings');
    return response.json();
  }
  
  static async updateBookingStatus(id: string, status: string): Promise<Booking> {
    const response = await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return response.json();
  }
}
```

### Authentication
Add authentication wrapper:

```typescript
// Wrap dashboard with auth provider
<AuthProvider>
  <AdminDashboard />
</AuthProvider>
```

### Database Schema
The types defined in `/types/index.ts` can guide your database schema:

- `professionals` table
- `bookings` table  
- `customers` table
- `earnings` table
- `notifications` table

## 📱 Usage

### Getting Started
```tsx
import { AdminDashboard } from '@/components/admin';

function App() {
  return <AdminDashboard />;
}
```

### Customization
- **Colors**: Modify theme colors in tailwind.config.js
- **Branding**: Update logo and company name in AdminDashboard.tsx
- **Features**: Add/remove components as needed

### Demo Data
The dashboard includes realistic mock data for demonstration:
- 3 sample bookings (pending, accepted, completed)
- Professional profile (John Smith, Plumber)
- Earnings history
- Notifications

## 🛠️ Development

### Dependencies
- React 18+
- TypeScript
- Tailwind CSS
- Radix UI (for tabs)
- Lucide React (for icons)
- shadcn/ui components

### File Structure
```
admin/
├── types/index.ts              # All TypeScript interfaces
├── services/mockDataService.ts # Mock API service
├── components/
│   ├── DashboardOverview.tsx   # Main dashboard page
│   ├── BookingsManagement.tsx  # Booking management
│   ├── CalendarView.tsx        # Calendar component
│   ├── EarningsPayments.tsx    # Financial tracking
│   └── ProfileManagement.tsx   # Profile settings
├── shared/                     # Shared utilities & components
│   ├── components/
│   │   └── StatusBadge.tsx     # Reusable status badges
│   ├── hooks/
│   │   └── useApi.ts           # Generic API hooks
│   └── utils/
│       └── formatters.ts       # Formatting utilities
├── constants/
│   └── statusOptions.ts        # Status constants & colors
├── AdminDashboard.tsx          # Main layout
└── index.ts                    # Component exports
```

### 🎯 **Quick Start - Use Shared Utilities**
```typescript
// Import shared utilities
import { 
  formatCurrency, 
  formatDate, 
  BookingStatusBadge, 
  BOOKING_STATUSES 
} from '@/components/admin';

// Use in your components
<span>{formatCurrency(1500)}</span>  // €1,500
<span>{formatDate("2024-01-20")}</span>  // 20 Jan 2024
<BookingStatusBadge status="pending" />
if (status === BOOKING_STATUSES.PENDING) { ... }
```

### Adding New Features
1. Create component in `/components/`
2. Add to navigation in `AdminDashboard.tsx`
3. Update types in `/types/index.ts`
4. Add mock data to `mockDataService.ts`
5. **Use shared utilities** for consistent formatting
6. **Use shared constants** for type safety

## 🚀 Future Enhancements

### Planned Features
- **Analytics Dashboard**: Charts and graphs for business insights
- **Notification System**: Real-time push notifications
- **Messaging System**: Built-in chat with customers
- **Document Upload**: Contract and certification management
- **Multi-language Support**: Internationalization
- **Advanced Filtering**: Complex search and filter options

### Performance Optimizations
- **Lazy Loading**: Component-based code splitting
- **Caching**: API response caching
- **Virtualization**: For large lists
- **Optimistic Updates**: Instant UI feedback

This admin dashboard provides a complete foundation for managing service professional workflows while maintaining flexibility for future customization and backend integration. 