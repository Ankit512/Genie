import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Filter,
  Briefcase,
  TrendingUp,
  Users,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useProfessionalAuth } from '@/hooks/useProfessionalAuth';
import { getAvailableJobs, createBid, Job as FirebaseJob } from '@/lib/firebase-jobs';
import { JobBiddingModal } from './JobBiddingModal';

// Extended Job interface for display purposes
interface DisplayJob extends Omit<FirebaseJob, 'budget' | 'createdAt' | 'updatedAt'> {
  budget: string; // Display format like "€80-120"
  timeframe: string;
  postedAt: Date;
  customerRating: number;
}

export function EnhancedProfessionalDashboard() {
  const { user, professionalProfile } = useProfessionalAuth();
  const [jobs, setJobs] = useState<DisplayJob[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredJobs, setFilteredJobs] = useState<DisplayJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<DisplayJob | null>(null);
  const [showBiddingModal, setShowBiddingModal] = useState(false);

  // Load jobs from Firebase
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        const firebaseJobs = await getAvailableJobs({
          category: selectedCategory !== 'all' ? selectedCategory : undefined
        });
        
        // Convert Firebase jobs to display format
        const displayJobs: DisplayJob[] = firebaseJobs.map(job => ({
          ...job,
          budget: `€${job.budget.min}-${job.budget.max}`,
          timeframe: job.timeframe,
          postedAt: job.createdAt.toDate(),
          customerRating: job.customerRating || 4.5
        }));
        
        setJobs(displayJobs);
      } catch (error) {
        console.error('Failed to load jobs:', error);
        // Set empty array on error
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadJobs();
  }, [selectedCategory]);

  // Filter jobs based on search term
  useEffect(() => {
    let filtered = jobs;
    
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.location.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredJobs(filtered);
  }, [jobs, searchTerm]);

  const handleExpressInterest = (job: DisplayJob) => {
    setSelectedJob(job);
    setShowBiddingModal(true);
  };

  const handleSubmitBid = async (bidData: {
    bidAmount: number;
    proposedTimeframe: string;
    message: string;
  }) => {
    if (!user || !professionalProfile || !selectedJob) return;
    
    try {
      await createBid({
        jobId: selectedJob.id!,
        professionalId: user.uid,
        professionalName: `${professionalProfile.firstName || ''} ${professionalProfile.lastName || ''}`.trim() || 'Professional',
        professionalRating: 4.8, // This would come from professional profile
        ...bidData
      });
      
      setShowBiddingModal(false);
      setSelectedJob(null);
      
      // Refresh jobs to update bid count
      const firebaseJobs = await getAvailableJobs({
        category: selectedCategory !== 'all' ? selectedCategory : undefined
      });
      
      const displayJobs: DisplayJob[] = firebaseJobs.map(job => ({
        ...job,
        budget: `€${job.budget.min}-${job.budget.max}`,
        timeframe: job.timeframe,
        postedAt: job.createdAt.toDate(),
        customerRating: job.customerRating || 4.5
      }));
      
      setJobs(displayJobs);
    } catch (error) {
      console.error('Failed to submit bid:', error);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Required</h2>
            <p className="text-gray-600 mb-4">Please sign in to access your professional dashboard.</p>
            <Button onClick={() => window.location.href = '/professional/login'}>
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {professionalProfile?.firstName || 'Professional'}!
              </h1>
              <p className="text-gray-600 mt-1">
                {professionalProfile?.status === 'approved' 
                  ? 'Find new opportunities and grow your business' 
                  : 'Complete your profile to start receiving job opportunities'
                }
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {professionalProfile?.status === 'pending' && (
                <Badge variant="secondary" className="flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Pending Approval
                </Badge>
              )}
              {professionalProfile?.status === 'approved' && (
                <Badge variant="default" className="flex items-center bg-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified Pro
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredJobs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Bids</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rating</p>
                  <p className="text-2xl font-bold text-gray-900">-</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Browse Job Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search jobs by title, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="Cleaning & Pest Control">Cleaning & Pest Control</option>
                <option value="Beauty & Wellness">Beauty & Wellness</option>
                <option value="IT Services">IT Services</option>
              </select>
              <Button variant="outline" className="flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Job Listings */}
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      <Badge className={getUrgencyColor(job.urgency)}>
                        {job.urgency} priority
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{job.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-1" />
                        {job.category}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {job.budget}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {job.timeframe}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {job.bidsCount} bids
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right ml-6">
                    <div className="flex items-center mb-2">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{job.customerRating}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{formatTimeAgo(job.postedAt)}</p>
                    <Button 
                      onClick={() => handleExpressInterest(job)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Place Bid
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600">
                Try adjusting your search terms or filters to find more opportunities.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Job Bidding Modal */}
      {showBiddingModal && selectedJob && (
        <JobBiddingModal
          job={{
            id: selectedJob.id!,
            title: selectedJob.title,
            description: selectedJob.description,
            budget: selectedJob.budget,
            location: selectedJob.location,
            timeframe: selectedJob.timeframe,
            category: selectedJob.category,
            customerRating: selectedJob.customerRating
          }}
          isOpen={showBiddingModal}
          onClose={() => {
            setShowBiddingModal(false);
            setSelectedJob(null);
          }}
          onSubmitBid={async (bidData) => {
            await handleSubmitBid({
              bidAmount: bidData.bidAmount,
              proposedTimeframe: bidData.proposedTimeframe,
              message: bidData.message
            });
          }}
        />
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-900">Loading jobs...</span>
          </div>
        </div>
      )}
    </div>
  );
}
