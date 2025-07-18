import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { applyActionCode, checkActionCode, getAuth } from 'firebase/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function EmailVerificationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');
  const auth = getAuth();

  useEffect(() => {
    const verifyEmail = async () => {
      const mode = searchParams.get('mode');
      const oobCode = searchParams.get('oobCode');

      if (mode !== 'verifyEmail' || !oobCode) {
        setStatus('error');
        setError('Invalid verification link');
        return;
      }

      try {
        // Check the action code is valid
        const info = await checkActionCode(auth, oobCode);
        
        // Apply the verification code
        await applyActionCode(auth, oobCode);
        
        setStatus('success');
      } catch (error: any) {
        setStatus('error');
        if (error.code === 'auth/expired-action-code') {
          setError('This verification link has expired. Please request a new one.');
        } else if (error.code === 'auth/invalid-action-code') {
          setError('This verification link is invalid or has already been used.');
        } else if (error.code === 'auth/user-disabled') {
          setError('This user account has been disabled.');
        } else {
          setError('Failed to verify email. Please try again.');
        }
      }
    };

    verifyEmail();
  }, [searchParams, auth]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Email Verification</CardTitle>
        </CardHeader>
        <CardContent>
          {status === 'loading' && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Verifying your email...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Email Verified Successfully!</h3>
              <p className="text-muted-foreground mb-6">
                Your email has been verified. You can now log in to your account.
              </p>
              <Button onClick={() => navigate('/login')} className="w-full">
                Go to Login
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-8">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Verification Failed</h3>
              <p className="text-muted-foreground mb-6">{error}</p>
              <div className="space-y-3">
                <Button onClick={() => navigate('/register')} variant="outline" className="w-full">
                  Back to Registration
                </Button>
                <Button onClick={() => navigate('/login')} className="w-full">
                  Go to Login
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 