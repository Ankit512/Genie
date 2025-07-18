import { Badge } from '@/components/ui/badge';
import { 
  BOOKING_STATUSES, 
  PAYMENT_STATUSES, 
  BOOKING_STATUS_COLORS, 
  PAYMENT_STATUS_COLORS,
  BOOKING_STATUS_LABELS,
  PAYMENT_STATUS_LABELS
} from '../../constants/statusOptions';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  type?: 'booking' | 'payment';
  showIcon?: boolean;
  className?: string;
}

export function StatusBadge({ 
  status, 
  type = 'booking', 
  showIcon = true, 
  className = '' 
}: StatusBadgeProps) {
  const getStatusColor = () => {
    if (type === 'booking') {
      return BOOKING_STATUS_COLORS[status as keyof typeof BOOKING_STATUS_COLORS] || 'bg-gray-500';
    } else {
      return PAYMENT_STATUS_COLORS[status as keyof typeof PAYMENT_STATUS_COLORS] || 'bg-gray-500';
    }
  };

  const getStatusLabel = () => {
    if (type === 'booking') {
      return BOOKING_STATUS_LABELS[status as keyof typeof BOOKING_STATUS_LABELS] || status;
    } else {
      return PAYMENT_STATUS_LABELS[status as keyof typeof PAYMENT_STATUS_LABELS] || status;
    }
  };

  const getStatusIcon = () => {
    if (!showIcon) return null;

    if (type === 'booking') {
      switch (status) {
        case BOOKING_STATUSES.PENDING:
          return <Clock className="h-3 w-3" />;
        case BOOKING_STATUSES.ACCEPTED:
        case BOOKING_STATUSES.COMPLETED:
          return <CheckCircle className="h-3 w-3" />;
        case BOOKING_STATUSES.REJECTED:
        case BOOKING_STATUSES.CANCELLED:
          return <XCircle className="h-3 w-3" />;
        default:
          return <AlertCircle className="h-3 w-3" />;
      }
    } else {
      switch (status) {
        case PAYMENT_STATUSES.PAID:
          return <CheckCircle className="h-3 w-3" />;
        case PAYMENT_STATUSES.PENDING:
          return <Clock className="h-3 w-3" />;
        case PAYMENT_STATUSES.PROCESSING:
          return <AlertCircle className="h-3 w-3" />;
        default:
          return <AlertCircle className="h-3 w-3" />;
      }
    }
  };

  return (
    <Badge 
      variant="secondary"
      className={`${getStatusColor()} text-white ${className}`}
    >
      {getStatusIcon()}
      {showIcon && <span className="ml-1">{getStatusLabel()}</span>}
      {!showIcon && <span>{getStatusLabel()}</span>}
    </Badge>
  );
}

// Specific variants for better TypeScript support
export function BookingStatusBadge({ 
  status, 
  showIcon = true, 
  className = '' 
}: { 
  status: string; 
  showIcon?: boolean; 
  className?: string; 
}) {
  return (
    <StatusBadge 
      status={status} 
      type="booking" 
      showIcon={showIcon} 
      className={className} 
    />
  );
}

export function PaymentStatusBadge({ 
  status, 
  showIcon = true, 
  className = '' 
}: { 
  status: string; 
  showIcon?: boolean; 
  className?: string; 
}) {
  return (
    <StatusBadge 
      status={status} 
      type="payment" 
      showIcon={showIcon} 
      className={className} 
    />
  );
} 