/**
 * Constants for status options and colors across the admin dashboard
 */

export const BOOKING_STATUSES = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  PAID: 'paid',
  PROCESSING: 'processing',
} as const;

export const NOTIFICATION_TYPES = {
  NEW_BOOKING: 'new_booking',
  BOOKING_CHANGE: 'booking_change',
  PAYMENT: 'payment',
  SYSTEM: 'system',
} as const;

export const BOOKING_STATUS_COLORS = {
  [BOOKING_STATUSES.PENDING]: 'bg-yellow-500',
  [BOOKING_STATUSES.ACCEPTED]: 'bg-blue-500',
  [BOOKING_STATUSES.COMPLETED]: 'bg-green-500',
  [BOOKING_STATUSES.REJECTED]: 'bg-red-500',
  [BOOKING_STATUSES.CANCELLED]: 'bg-gray-500',
} as const;

export const PAYMENT_STATUS_COLORS = {
  [PAYMENT_STATUSES.PAID]: 'bg-green-500',
  [PAYMENT_STATUSES.PENDING]: 'bg-yellow-500',
  [PAYMENT_STATUSES.PROCESSING]: 'bg-blue-500',
} as const;

export const BOOKING_STATUS_LABELS = {
  [BOOKING_STATUSES.PENDING]: 'Pending',
  [BOOKING_STATUSES.ACCEPTED]: 'Accepted',
  [BOOKING_STATUSES.COMPLETED]: 'Completed',
  [BOOKING_STATUSES.REJECTED]: 'Rejected',
  [BOOKING_STATUSES.CANCELLED]: 'Cancelled',
} as const;

export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUSES.PAID]: 'Paid',
  [PAYMENT_STATUSES.PENDING]: 'Pending',
  [PAYMENT_STATUSES.PROCESSING]: 'Processing',
} as const;

export const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
] as const;

export const DATE_FILTER_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
] as const;

export const DASHBOARD_ROUTES = {
  DASHBOARD: 'dashboard',
  BOOKINGS: 'bookings',
  CALENDAR: 'calendar',
  EARNINGS: 'earnings',
  PROFILE: 'profile',
} as const;

export const DEFAULT_PAGINATION = {
  PAGE_SIZE: 10,
  INITIAL_PAGE: 1,
} as const;

export const CURRENCY_SYMBOL = '€';

export const PHONE_COUNTRY_CODE = '+353';

export const NOTIFICATION_DURATION = 5000; // 5 seconds 