import { useAuth } from '@/hooks/useAuth'
import { Navigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Clock, Star, ChevronRight } from 'lucide-react'

export function BookingHistoryPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return null
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Mock booking history data
  const bookings = [
    {
      id: 1,
      service: 'Plumbing Repair',
      provider: 'John Smith',
      date: '2024-01-15',
      time: '10:00 AM',
      address: '123 Main St, Dublin',
      status: 'completed',
      rating: 5,
      price: 85
    },
    {
      id: 2,
      service: 'House Cleaning',
      provider: 'Sarah Johnson',
      date: '2024-01-20',
      time: '2:00 PM',
      address: '456 Oak Ave, Cork',
      status: 'completed',
      rating: 4,
      price: 75
    },
    {
      id: 3,
      service: 'Electrical Work',
      provider: 'Mike Wilson',
      date: '2024-01-25',
      time: '9:00 AM',
      address: '789 Pine Rd, Galway',
      status: 'upcoming',
      rating: null,
      price: 120
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Booking History</h1>
        <p className="text-muted-foreground">View and manage your service bookings</p>
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.id} className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{booking.service}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Provider: {booking.provider}
                  </p>
                </div>
                <Badge className={getStatusColor(booking.status)}>
                  {booking.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {booking.date}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {booking.time}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {booking.address}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium">€{booking.price}</span>
                </div>
              </div>

              {booking.rating && (
                <div className="flex items-center gap-1 mb-4">
                  <span className="text-sm text-muted-foreground">Rating:</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < booking.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  View Details
                  <ChevronRight className="h-3 w-3" />
                </Button>
                {booking.status === 'completed' && !booking.rating && (
                  <Button variant="outline" size="sm">
                    Leave Review
                  </Button>
                )}
                {booking.status === 'upcoming' && (
                  <Button variant="outline" size="sm">
                    Reschedule
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  Book Again
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {bookings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No bookings found</p>
          <Button asChild>
            <a href="/services">Browse Services</a>
          </Button>
        </div>
      )}
    </div>
  )
} 