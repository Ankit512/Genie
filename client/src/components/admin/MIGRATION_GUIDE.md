# Admin Dashboard Migration Guide

## 🎯 **Quick Wins - Immediate Improvements**

### 1. **Use Shared Utilities** (✅ Already Available)

Replace hardcoded formatting with shared utilities:

```typescript
// Before
<span>€{booking.price}</span>

// After
import { formatCurrency } from '@/components/admin';
<span>{formatCurrency(booking.price)}</span>
```

### 2. **Use Status Badge Component** (✅ Already Available)

Replace custom status badges:

```typescript
// Before
<Badge className="bg-yellow-500 text-white">Pending</Badge>

// After
import { BookingStatusBadge } from '@/components/admin';
<BookingStatusBadge status="pending" />
```

### 3. **Use Constants** (✅ Already Available)

Replace magic strings:

```typescript
// Before
if (booking.status === 'pending') { ... }

// After
import { BOOKING_STATUSES } from '@/components/admin';
if (booking.status === BOOKING_STATUSES.PENDING) { ... }
```

## 📈 **Phase 1: Extract Custom Hooks**

Create feature-specific hooks to simplify components:

```typescript
// features/bookings/hooks/useBookings.ts
import { useApi, useMutation } from '@/components/admin/shared/hooks/useApi';
import { MockDataService } from '@/components/admin';

export function useBookings() {
  const { data: bookings, loading, error, refetch } = useApi(
    () => MockDataService.getBookings(),
    []
  );

  const { mutate: updateStatus, loading: updating } = useMutation(
    ({ id, status }: { id: string; status: string }) =>
      MockDataService.updateBookingStatus(id, status)
  );

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateStatus({ id, status });
      refetch(); // Refresh data after update
    } catch (error) {
      console.error('Failed to update booking status:', error);
    }
  };

  return {
    bookings: bookings || [],
    loading,
    error,
    updating,
    updateStatus: handleStatusUpdate,
    refetch,
  };
}
```

Then use it in your component:

```typescript
// components/BookingsManagement.tsx
import { useBookings } from '../features/bookings/hooks/useBookings';

export function BookingsManagement() {
  const { bookings, loading, updating, updateStatus } = useBookings();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {bookings.map(booking => (
        <div key={booking.id}>
          <h3>{booking.serviceType}</h3>
          <button 
            onClick={() => updateStatus(booking.id, 'accepted')}
            disabled={updating}
          >
            Accept
          </button>
        </div>
      ))}
    </div>
  );
}
```

## 📈 **Phase 2: Component Composition**

Break down large components into smaller, reusable pieces:

```typescript
// features/bookings/components/BookingCard.tsx
import { BookingStatusBadge, formatCurrency, formatDate } from '@/components/admin';

interface BookingCardProps {
  booking: Booking;
  onStatusUpdate: (id: string, status: string) => void;
  updating?: boolean;
}

export function BookingCard({ booking, onStatusUpdate, updating }: BookingCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{booking.serviceType}</h3>
        <BookingStatusBadge status={booking.status} />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p><strong>Customer:</strong> {booking.customer.name}</p>
          <p><strong>Date:</strong> {formatDate(booking.scheduledDate)}</p>
        </div>
        <div>
          <p><strong>Price:</strong> {formatCurrency(booking.price)}</p>
          <p><strong>Location:</strong> {booking.location.city}</p>
        </div>
      </div>

      {booking.status === 'pending' && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onStatusUpdate(booking.id, 'accepted')}
            disabled={updating}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Accept
          </button>
          <button
            onClick={() => onStatusUpdate(booking.id, 'rejected')}
            disabled={updating}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
```

## 📈 **Phase 3: Service Abstraction**

Create API service layer:

```typescript
// services/api/bookingsApi.ts
import { Booking } from '@/components/admin/types';

export interface BookingsApiInterface {
  getBookings: (status?: string) => Promise<Booking[]>;
  updateBookingStatus: (id: string, status: string) => Promise<Booking>;
}

// Mock implementation
export const mockBookingsApi: BookingsApiInterface = {
  getBookings: (status?: string) => {
    // Mock implementation
    return Promise.resolve([]);
  },
  updateBookingStatus: (id: string, status: string) => {
    // Mock implementation
    return Promise.resolve({} as Booking);
  },
};

// Real API implementation (when ready)
export const realBookingsApi: BookingsApiInterface = {
  getBookings: async (status?: string) => {
    const url = status ? `/api/bookings?status=${status}` : '/api/bookings';
    const response = await fetch(url);
    return response.json();
  },
  updateBookingStatus: async (id: string, status: string) => {
    const response = await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return response.json();
  },
};

// Export current implementation
export const bookingsApi = mockBookingsApi; // Switch to realBookingsApi when ready
```

## 🔄 **Migration Steps**

### Step 1: Start Using Shared Utilities (5 minutes)
```bash
# Update imports in existing components
import { formatCurrency, formatDate, BookingStatusBadge } from '@/components/admin';
```

### Step 2: Extract One Custom Hook (30 minutes)
```bash
# Create first custom hook
mkdir -p client/src/components/admin/features/bookings/hooks
# Create useBookings.ts
# Update BookingsManagement.tsx to use the hook
```

### Step 3: Create Smaller Components (1 hour)
```bash
# Break down BookingsManagement into smaller pieces
mkdir -p client/src/components/admin/features/bookings/components
# Create BookingCard.tsx, BookingFilters.tsx, etc.
```

### Step 4: Service Abstraction (1 hour)
```bash
# Create API service layer
mkdir -p client/src/components/admin/services/api
# Create bookingsApi.ts, earningsApi.ts, etc.
```

## 🎯 **Benefits You'll See Immediately**

1. **Consistent Formatting**: All currency and dates look the same
2. **Reusable Components**: Status badges work everywhere
3. **Type Safety**: Constants prevent typos
4. **Easier Testing**: Hooks can be tested independently
5. **Better Maintenance**: Clear separation of concerns

## 📋 **Quick Reference**

### Available Now:
- `formatCurrency()` - Format money amounts
- `formatDate()` - Format dates consistently
- `BookingStatusBadge` - Status badges with icons
- `BOOKING_STATUSES` - Type-safe status constants
- `useApi()` - Generic data fetching hook

### Usage Examples:
```typescript
// Formatting
formatCurrency(1500) // "€1,500"
formatDate("2024-01-20") // "20 Jan 2024"

// Status badges
<BookingStatusBadge status="pending" />
<PaymentStatusBadge status="paid" />

// Constants
BOOKING_STATUSES.PENDING // "pending"
BOOKING_STATUS_COLORS.PENDING // "bg-yellow-500"

// Hooks
const { data, loading, error } = useApi(() => MockDataService.getBookings());
```

This migration can be done incrementally without breaking existing functionality! 