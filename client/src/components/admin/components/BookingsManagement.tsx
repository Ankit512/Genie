import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Euro,
  User,
  MessageSquare
} from 'lucide-react';
import { Booking } from '../types';
import { MockDataService } from '../services/mockDataService';

export function BookingsManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
      try {
        const bookingsData = await MockDataService.getBookings();
        setBookings(bookingsData);
      } catch (error) {
        console.error('Error loading bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const handleStatusUpdate = async (bookingId: string, newStatus: Booking['status']) => {
    try {
      await MockDataService.updateBookingStatus(bookingId, newStatus);
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus, updatedAt: new Date().toISOString() }
          : booking
      ));
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'accepted': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filteredBookings = activeTab === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === activeTab);

  const getTabCount = (status: string) => {
    if (status === 'all') return bookings.length;
    return bookings.filter(booking => booking.status === status).length;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Bookings Management</h1>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bookings Management</h1>
          <p className="text-muted-foreground">Manage your booking requests and scheduled jobs</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar View
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            All ({getTabCount('all')})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({getTabCount('pending')})
          </TabsTrigger>
          <TabsTrigger value="accepted">
            Accepted ({getTabCount('accepted')})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({getTabCount('completed')})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({getTabCount('rejected')})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
                <p className="text-muted-foreground">
                  {activeTab === 'all' 
                    ? "You don't have any bookings yet." 
                    : `No ${activeTab} bookings at the moment.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{booking.serviceType}</CardTitle>
                      <p className="text-muted-foreground">Booking #{booking.id}</p>
                    </div>
                    <Badge 
                      variant={booking.status === 'pending' ? 'default' : 'secondary'}
                      className={`${getStatusColor(booking.status)} text-white`}
                    >
                      {getStatusIcon(booking.status)}
                      <span className="ml-1 capitalize">{booking.status}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{booking.customer.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.customer.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.customer.email}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(booking.scheduledDate).toLocaleDateString()} at {booking.scheduledTime}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.location.address}, {booking.location.city}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Euro className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">€{booking.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="font-medium mb-2">Service Description</h4>
                    <p className="text-muted-foreground">{booking.description}</p>
                  </div>

                  {/* Special Instructions */}
                  {booking.specialInstructions && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Special Instructions
                      </h4>
                      <p className="text-muted-foreground bg-muted p-3 rounded-lg">
                        {booking.specialInstructions}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {booking.status === 'pending' && (
                      <>
                        <Button 
                          onClick={() => handleStatusUpdate(booking.id, 'accepted')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept
                        </Button>
                        <Button 
                          variant="destructive"
                          onClick={() => handleStatusUpdate(booking.id, 'rejected')}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                    {booking.status === 'accepted' && (
                      <>
                        <Button 
                          onClick={() => handleStatusUpdate(booking.id, 'completed')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark Complete
                        </Button>
                        <Button variant="outline">
                          <Calendar className="h-4 w-4 mr-2" />
                          Reschedule
                        </Button>
                      </>
                    )}
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Customer
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>

                  {/* Timestamps */}
                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    <div className="flex justify-between">
                      <span>Created: {new Date(booking.createdAt).toLocaleString()}</span>
                      <span>Updated: {new Date(booking.updatedAt).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 