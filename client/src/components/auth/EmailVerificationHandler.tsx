import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { applyActionCode, checkActionCode } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export function EmailVerificationHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'expired'>('verifying');
  const [message, setMessage] = useState('');
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const handleEmailVerification = async () => {
      // Debug: Log all URL parameters
      console.log('All URL params:', Object.fromEntries(searchParams));
      console.log('Current URL:', window.location.href);
      
      const mode = searchParams.get('mode');
      const oobCode = searchParams.get('oobCode');
      const apiKey = searchParams.get('apiKey');
      const continueUrl = searchParams.get('continueUrl');
      
      console.log('Parsed params:', { mode, oobCode, apiKey, continueUrl });
      
      // Store debug info for display
      setDebugInfo({
        url: window.location.href,
        allParams: Object.fromEntries(searchParams),
        parsedParams: { mode, oobCode, apiKey, continueUrl }
      });

      // Check if this is an email verification action
      // Handle both 'verifyEmail' and 'verify' modes (Firebase sometimes uses different formats)
      if ((mode !== 'verifyEmail' && mode !== 'verify') || !oobCode) {
        // Check if we're on a verification page but without proper params
        // This might happen if user navigated directly or from a malformed link
        if (window.location.pathname.includes('verify-email')) {
          console.error('On verification page but missing parameters:', { mode, oobCode });
          setStatus('error');
          setMessage('This verification link is invalid or incomplete. Please check your email for a new verification link.');
        } else {
          console.error('Invalid verification parameters:', { mode, oobCode });
          setStatus('error');
          setMessage(`Invalid verification link. Mode: ${mode}, Code: ${oobCode ? 'present' : 'missing'}`);
        }
        // Removed auto-redirect for debugging - user can manually navigate
        console.log('Auto-redirect disabled for debugging');
        return;
      }

      try {
        // First, check if the action code is valid
        const info = await checkActionCode(auth, oobCode);
        console.log('Action code info:', info);

        // Apply the email verification
        await applyActionCode(auth, oobCode);
        
        setStatus('success');
        setMessage('Email verified successfully! You can now sign in.');
        
        // Redirect to login page after 5 seconds (longer for debugging)
        setTimeout(() => {
          navigate('/login?verified=true');
        }, 5000);

      } catch (error: any) {
        console.error('Email verification error:', error);
        
        // Handle specific error cases
        if (error.code === 'auth/expired-action-code') {
          setStatus('expired');
          setMessage('This verification link has expired. Please request a new verification email.');
        } else if (error.code === 'auth/invalid-action-code') {
          setStatus('expired');
          setMessage('This verification link is invalid or has already been used.');
        } else {
          setStatus('error');
          setMessage('Failed to verify email. Please try again.');
        }

        // Redirect to login page after showing error (longer for debugging)
        setTimeout(() => {
          navigate('/login');
        }, 8000);
      }
    };

    handleEmailVerification();
  }, [searchParams, navigate]);

  const getStatusIcon = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        );
      case 'success':
        return (
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'expired':
        return (
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'expired':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
        </div>
        
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <div className="space-y-6">
            {getStatusIcon()}
            
            <div className="text-center">
              <h3 className={`text-lg font-medium ${getStatusColor()}`}>
                {status === 'verifying' && 'Verifying your email...'}
                {status === 'success' && 'Email Verified!'}
                {status === 'expired' && 'Link Expired'}
                {status === 'error' && 'Verification Failed'}
              </h3>
              
              <p className="mt-2 text-sm text-gray-600">
                {message}
              </p>
              
              {status !== 'verifying' && (
                <p className="mt-4 text-xs text-gray-500">
                  {status === 'success' 
                    ? 'Redirecting to login page...'
                    : 'Redirecting to login page in a few seconds...'
                  }
                </p>
              )}
              
              {/* Debug Information */}
              {debugInfo && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg text-left">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Debug Information:</h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p><strong>URL:</strong> {debugInfo.url}</p>
                    <p><strong>Mode:</strong> {debugInfo.parsedParams.mode || 'missing'}</p>
                    <p><strong>OOB Code:</strong> {debugInfo.parsedParams.oobCode ? 'present' : 'missing'}</p>
                    <p><strong>API Key:</strong> {debugInfo.parsedParams.apiKey ? 'present' : 'missing'}</p>
                    <p><strong>Continue URL:</strong> {debugInfo.parsedParams.continueUrl || 'missing'}</p>
                    <details className="mt-2">
                      <summary className="cursor-pointer text-gray-500">All Parameters</summary>
                      <pre className="mt-1 text-xs bg-white p-2 rounded border overflow-auto">
                        {JSON.stringify(debugInfo.allParams, null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
