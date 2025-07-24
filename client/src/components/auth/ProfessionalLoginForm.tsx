import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  AlertCircle, 
  CheckCircle,
  Briefcase,
  ArrowRight
} from 'lucide-react';
import { 
  loginProfessionalWithEmail, 
  requireProfessionalEmailVerification,
  resetProfessionalPassword 
} from '@/lib/firebase-professional';
import { useProfessionalAuth } from '@/hooks/useProfessionalAuth';

export function ProfessionalLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, emailVerified } = useProfessionalAuth();

  // Check for password reset success message
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('reset') === 'success') {
      setError('');
      // You can add a success message here if needed
    }
  }, [location]);

  // Redirect if already logged in and verified
  useEffect(() => {
    if (user && emailVerified) {
      navigate('/professional/dashboard');
    }
  }, [user, emailVerified, navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await loginProfessionalWithEmail(email, password);
      await requireProfessionalEmailVerification(result.user);
      navigate('/professional/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  // Google sign-in removed for professionals - email/password only

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await resetProfessionalPassword(email);
      setResetSent(true);
      setShowResetForm(false);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Professional Sign In
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Access your professional dashboard and manage your services
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          )}

          {resetSent && (
            <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-md">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-green-800 text-sm">
                Password reset email sent! Check your inbox and follow the instructions.
              </span>
            </div>
          )}

          {!showResetForm ? (
            <>
              {/* Email Login Form */}
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowResetForm(true)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                    disabled={loading}
                  >
                    Forgot password?
                  </button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              {/* Professional login uses email/password only - no social login */}

              {/* Registration Link */}
              <div className="text-center">
                <Link to="/professional/application">
                  <Button variant="outline" className="w-full mb-2">Apply Now</Button>
                </Link>
              </div>

              {/* Back to Customer Portal */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Looking for services?{' '}
                  <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                    Customer Login →
                  </Link>
                </p>
              </div>
            </>
          ) : (
            /* Password Reset Form */
            <>
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Reset Password</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Enter your email address and we'll send you a reset link
                </p>
              </div>

              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div>
                  <Label htmlFor="reset-email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={loading || !email}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowResetForm(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
