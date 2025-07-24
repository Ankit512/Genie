import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  AlertCircle, 
  CheckCircle, 
  Briefcase,
  UserPlus,
  Loader2
} from 'lucide-react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { registerProfessionalWithEmail } from '@/lib/firebase-professional';

interface ApprovedProfessional {
  id: string;
  applicationId: string;
  signupToken: string;
  email: string;
  firstName: string;
  lastName: string;
  used: boolean;
}

interface ApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  street: string;
  city: string;
  county: string;
  eircode: string;
  citizenship: string;
  visaType?: string;
  visaExpiry?: string;
  services: string[];
  experience: string;
  ppsn: string;
  bio: string;
  availability?: string;
}

export function ProfessionalSignup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [approvedProfessional, setApprovedProfessional] = useState<ApprovedProfessional | null>(null);
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  useEffect(() => {
    validateToken();
  }, [token]);

  const validateToken = async () => {
    if (!token) {
      setError('Invalid or missing signup token');
      setValidating(false);
      return;
    }

    try {
      // Find the approved professional record
      const approvedRef = collection(db, 'approvedProfessionals');
      const q = query(approvedRef, where('signupToken', '==', token), where('used', '==', false));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError('Invalid or expired signup token');
        setValidating(false);
        return;
      }

      const approvedDoc = snapshot.docs[0];
      const approvedData = { id: approvedDoc.id, ...approvedDoc.data() } as ApprovedProfessional;
      
      // Fetch the original application data
      const applicationDoc = await getDoc(doc(db, 'professionalApplications', approvedData.applicationId));
      if (!applicationDoc.exists()) {
        setError('Application data not found');
        setValidating(false);
        return;
      }

      setApprovedProfessional(approvedData);
      setApplicationData(applicationDoc.data() as ApplicationData);
      setTokenValid(true);
    } catch (error) {
      console.error('Error validating token:', error);
      setError('Failed to validate signup token');
    } finally {
      setValidating(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!approvedProfessional || !applicationData) {
      setError('Invalid application data');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Create the professional account
      const userCredential = await registerProfessionalWithEmail(
        approvedProfessional.email,
        password
      );

      // Update the professional profile with complete data
      await updateDoc(doc(db, 'professionals', userCredential.user.uid), {
        firstName: applicationData.firstName,
        lastName: applicationData.lastName,
        phone: applicationData.phone,
        dateOfBirth: applicationData.dateOfBirth,
        address: {
          street: applicationData.street,
          city: applicationData.city,
          county: applicationData.county,
          eircode: applicationData.eircode
        },
        citizenship: applicationData.citizenship,
        visaType: applicationData.visaType,
        visaExpiry: applicationData.visaExpiry,
        services: applicationData.services,
        experience: applicationData.experience,
        ppsn: applicationData.ppsn,
        bio: applicationData.bio,
        availability: applicationData.availability,
        status: 'approved',
        needsOnboarding: false,
        applicationId: approvedProfessional.applicationId,
        updatedAt: serverTimestamp()
      });

      // Mark the signup token as used
      await updateDoc(doc(db, 'approvedProfessionals', approvedProfessional.id), {
        used: true,
        usedAt: serverTimestamp(),
        professionalId: userCredential.user.uid
      });

      setSignupSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Validating your signup link...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900">
              Invalid Signup Link
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">{error}</p>
            <p className="text-sm text-gray-500">
              If you believe this is an error, please contact support.
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (signupSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900">
              Account Created Successfully!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Your professional account has been created. Please check your email to verify your account.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Next Steps:</strong>
                <br />1. Check your email for verification link
                <br />2. Verify your email address
                <br />3. Sign in to access your dashboard
              </p>
            </div>
            <Button 
              onClick={() => navigate('/professional/login')} 
              className="w-full"
            >
              Go to Professional Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Complete Your Registration
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Welcome {applicationData?.firstName}! Create your password to complete registration.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <p><strong>Email:</strong> {approvedProfessional?.email}</p>
            <p><strong>Name:</strong> {applicationData?.firstName} {applicationData?.lastName}</p>
            <p><strong>Services:</strong> {applicationData?.services.length} selected</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Create Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </div>
              ) : (
                <div className="flex items-center">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Professional Account
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 