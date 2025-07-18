import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Download,
  CreditCard,
  Filter,
  Search
} from 'lucide-react';
import { Earnings, DashboardStats } from '../types';
import { MockDataService } from '../services/mockDataService';

export function EarningsPayments() {
  const [earnings, setEarnings] = useState<Earnings[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadEarningsData = async () => {
      setLoading(true);
      try {
        const [earningsData, statsData] = await Promise.all([
          MockDataService.getEarnings(),
          MockDataService.getDashboardStats()
        ]);
        setEarnings(earningsData);
        setStats(statsData);
      } catch (error) {
        console.error('Error loading earnings data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEarningsData();
  }, []);

  const getStatusColor = (status: Earnings['status']) => {
    switch (status) {
      case 'paid': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: Earnings['status']) => {
    switch (status) {
      case 'paid': return '✓';
      case 'pending': return '○';
      case 'processing': return '⟳';
      default: return '?';
    }
  };

  const filteredEarnings = earnings.filter(earning => {
    const matchesSearch = earning.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         earning.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (dateFilter === 'all') return matchesSearch;
    
    const earningDate = new Date(earning.date);
    const today = new Date();
    
    switch (dateFilter) {
      case 'today':
        return matchesSearch && earningDate.toDateString() === today.toDateString();
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return matchesSearch && earningDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        return matchesSearch && earningDate >= monthAgo;
      default:
        return matchesSearch;
    }
  });

  const paidEarnings = filteredEarnings.filter(e => e.status === 'paid').reduce((sum, earning) => sum + earning.amount, 0);
  const pendingEarnings = filteredEarnings.filter(e => e.status === 'pending').reduce((sum, earning) => sum + earning.amount, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Earnings & Payments</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-foreground">Earnings & Payments</h1>
          <p className="text-muted-foreground">Track your income and payment history</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <CreditCard className="h-4 w-4 mr-2" />
            Request Payout
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{stats?.earnings.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              All time earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{stats?.earnings.thisMonth || 0}</div>
            <p className="text-xs text-muted-foreground">
              +€{stats?.earnings.thisWeek || 0} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Out</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">€{paidEarnings}</div>
            <p className="text-xs text-muted-foreground">
              Received payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">€{pendingEarnings}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting payment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="min-w-[200px]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select 
                value={dateFilter} 
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>

          {/* Earnings List */}
          <div className="space-y-4">
            {filteredEarnings.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No earnings found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || dateFilter !== 'all' 
                    ? 'No earnings match your current filters.' 
                    : 'You haven\'t received any payments yet.'}
                </p>
              </div>
            ) : (
              filteredEarnings.map((earning) => (
                <div key={earning.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">Payment #{earning.id}</h4>
                        <Badge 
                          variant="secondary"
                          className={`${getStatusColor(earning.status)} text-white`}
                        >
                          {getStatusIcon(earning.status)} {earning.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Booking:</span> #{earning.bookingId}
                        </div>
                        <div>
                          <span className="font-medium">Method:</span> {earning.paymentMethod}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {new Date(earning.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">€{earning.amount}</div>
                      <div className="text-xs text-muted-foreground">
                        {earning.status === 'paid' ? 'Received' : 'Pending'}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payout Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Bank Account</span>
              <Badge variant="outline">**** 1234</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Payout Schedule</span>
              <Badge variant="outline">Weekly</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Minimum Payout</span>
              <Badge variant="outline">€50</Badge>
            </div>
            <Button variant="outline" className="w-full">
              Update Payout Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Earnings Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completed Jobs</span>
                <span className="font-medium">{stats?.completedJobs || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Average per Job</span>
                <span className="font-medium">
                  €{stats?.completedJobs ? Math.round((stats.earnings.total / stats.completedJobs) * 100) / 100 : 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Success Rate</span>
                <span className="font-medium">{stats?.averageRating || 0}/5.0</span>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              View Detailed Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 