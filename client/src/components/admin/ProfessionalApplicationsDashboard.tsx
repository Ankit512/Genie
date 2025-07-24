import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  FileText,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  doc, 
  updateDoc, 
  serverTimestamp,
  deleteDoc,
  addDoc
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { format } from 'date-fns';
import { sendProfessionalApprovalEmail, sendProfessionalRejectionEmail } from '@/lib/admin-notifications';
import { auth } from '@/config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

interface ProfessionalApplication {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  street: string;
  city: string;
  county: string;
  eircode: string;
  citizenship: 'irish' | 'eu' | 'non-eu';
  visaType?: string;
  visaExpiry?: string;
  services: string[];
  experience: string;
  ppsn: string;
  bio: string;
  availability?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
  updatedAt: any;
  signupToken?: string;
}

export function ProfessionalApplicationsDashboard() {
  const [applications, setApplications] = useState<ProfessionalApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<ProfessionalApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedApplication, setSelectedApplication] = useState<ProfessionalApplication | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter]);

  const fetchApplications = async () => {
    try {
      const applicationsRef = collection(db, 'professionalApplications');
      const q = query(applicationsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const applicationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ProfessionalApplication[];
      
      setApplications(applicationsData);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.phone.includes(searchTerm)
      );
    }
    
    setFilteredApplications(filtered);
  };

  const generateSignupToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const handleApprove = async (applicationId: string) => {
    setActionLoading(applicationId);
    setError('');
    
    try {
      const application = applications.find(app => app.id === applicationId);
      if (!application) return;

      // Generate unique signup token
      const signupToken = generateSignupToken();
      
      // Update application status
      const applicationRef = doc(db, 'professionalApplications', applicationId);
      await updateDoc(applicationRef, {
        status: 'approved',
        signupToken,
        updatedAt: serverTimestamp()
      });

      // Create approved professional record
      await addDoc(collection(db, 'approvedProfessionals'), {
        applicationId,
        signupToken,
        email: application.email,
        firstName: application.firstName,
        lastName: application.lastName,
        createdAt: serverTimestamp(),
        used: false
      });

      // Send approval email with signup link
      const signupLink = `${window.location.origin}/professional/signup?token=${signupToken}`;
      await sendProfessionalApprovalEmail(
        application.email,
        application.firstName,
        signupLink
      );

      // Update local state
      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: 'approved', signupToken, updatedAt: new Date() }
          : app
      ));

      setSelectedApplication(null);
    } catch (error: any) {
      console.error('Error approving application:', error);
      setError('Failed to approve application');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (applicationId: string) => {
    setActionLoading(applicationId);
    setError('');
    
    try {
      const application = applications.find(app => app.id === applicationId);
      if (!application) return;

      // Update application status
      const applicationRef = doc(db, 'professionalApplications', applicationId);
      await updateDoc(applicationRef, {
        status: 'rejected',
        updatedAt: serverTimestamp()
      });

      // Send rejection email
      await sendProfessionalRejectionEmail(
        application.email,
        application.firstName
      );

      // Update local state
      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: 'rejected', updatedAt: new Date() }
          : app
      ));

      setSelectedApplication(null);
    } catch (error: any) {
      console.error('Error rejecting application:', error);
      setError('Failed to reject application');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Professional Applications</h1>
        <p className="text-gray-600">Review and manage professional service provider applications</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                size="sm"
              >
                All ({applications.length})
              </Button>
              <Button
                variant={statusFilter === 'pending' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('pending')}
                size="sm"
              >
                Pending ({applications.filter(a => a.status === 'pending').length})
              </Button>
              <Button
                variant={statusFilter === 'approved' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('approved')}
                size="sm"
              >
                Approved ({applications.filter(a => a.status === 'approved').length})
              </Button>
              <Button
                variant={statusFilter === 'rejected' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('rejected')}
                size="sm"
              >
                Rejected ({applications.filter(a => a.status === 'rejected').length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="grid gap-4">
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No applications found</p>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {application.firstName} {application.lastName}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {application.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {application.phone}
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(application.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Location:</span> {application.city}, {application.county}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Citizenship:</span> {application.citizenship.toUpperCase()}
                      {application.visaType && ` (${application.visaType})`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Experience:</span> {application.experience} years
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Applied:</span> {application.createdAt && format(application.createdAt.toDate(), 'PPP')}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Services:</p>
                  <div className="flex flex-wrap gap-2">
                    {application.services.map((service, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedApplication(application)}
                  >
                    View Details
                  </Button>
                  {application.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 hover:text-green-700"
                        onClick={() => handleApprove(application.id)}
                        disabled={actionLoading === application.id}
                      >
                        {actionLoading === application.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleReject(application.id)}
                        disabled={actionLoading === application.id}
                      >
                        {actionLoading === application.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Application Details</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedApplication(null)}
                >
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <p className="font-medium">{selectedApplication.firstName} {selectedApplication.lastName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Date of Birth:</span>
                    <p className="font-medium">{format(new Date(selectedApplication.dateOfBirth), 'PPP')}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-medium">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <p className="font-medium">{selectedApplication.phone}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Address
                </h3>
                <p className="text-sm">
                  {selectedApplication.street}<br />
                  {selectedApplication.city}, {selectedApplication.county}<br />
                  {selectedApplication.eircode}
                </p>
              </div>

              {/* Citizenship & Visa */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Citizenship & Work Authorization
                </h3>
                <div className="text-sm space-y-2">
                  <p>
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium ml-2">{selectedApplication.citizenship.toUpperCase()}</span>
                  </p>
                  {selectedApplication.visaType && (
                    <>
                      <p>
                        <span className="text-gray-600">Visa Type:</span>
                        <span className="font-medium ml-2">{selectedApplication.visaType}</span>
                      </p>
                      <p>
                        <span className="text-gray-600">Visa Expiry:</span>
                        <span className="font-medium ml-2">
                          {selectedApplication.visaExpiry && format(new Date(selectedApplication.visaExpiry), 'PPP')}
                        </span>
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Professional Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Services:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedApplication.services.map((service, index) => (
                        <Badge key={index} variant="secondary">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm">
                    <span className="text-gray-600">Experience:</span>
                    <span className="font-medium ml-2">{selectedApplication.experience} years</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-600">PPSN:</span>
                    <span className="font-medium ml-2">{selectedApplication.ppsn}</span>
                  </p>
                  {selectedApplication.availability && (
                    <p className="text-sm">
                      <span className="text-gray-600">Availability:</span>
                      <span className="font-medium ml-2">{selectedApplication.availability}</span>
                    </p>
                  )}
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Bio:</p>
                    <p className="text-sm bg-gray-50 p-3 rounded">{selectedApplication.bio}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedApplication.status === 'pending' && (
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedApplication(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleApprove(selectedApplication.id)}
                    disabled={actionLoading === selectedApplication.id}
                  >
                    {actionLoading === selectedApplication.id ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    Approve Application
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleReject(selectedApplication.id)}
                    disabled={actionLoading === selectedApplication.id}
                  >
                    {actionLoading === selectedApplication.id ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-2" />
                    )}
                    Reject Application
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 