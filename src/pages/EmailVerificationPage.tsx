import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  AcademicCapIcon, 
  ExclamationCircleIcon, 
  CheckCircleIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants';

export function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  
  const { verifyEmail, resendVerificationEmail, isLoading, user } = useAuth();
  const [verificationState, setVerificationState] = useState<'pending' | 'success' | 'error' | 'expired'>('pending');
  const [error, setError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  // Auto-verify if token is present
  useEffect(() => {
    if (token) {
      handleVerifyEmail(token);
    }
  }, [token]);

  const handleVerifyEmail = async (verificationToken: string) => {
    try {
      setError(null);
      await verifyEmail({ token: verificationToken });
      setVerificationState('success');
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate(ROUTES.DASHBOARD);
      }, 3000);
    } catch (error: any) {
      setError(error.message || 'Email verification failed');
      
      // Check if token is expired
      if (error.message?.includes('expired') || error.message?.includes('invalid')) {
        setVerificationState('expired');
      } else {
        setVerificationState('error');
      }
    }
  };

  const handleResendVerification = async () => {
    try {
      setIsResending(true);
      setError(null);
      await resendVerificationEmail();
      setVerificationState('pending');
    } catch (error: any) {
      setError(error.message || 'Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  // Success state
  if (verificationState === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Email verified successfully!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your email address has been verified. You now have full access to your account.
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Redirecting to your dashboard in 3 seconds...
            </p>
          </div>
          
          <div className="text-center">
            <Button
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="w-full"
            >
              Continue to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Error or expired token state
  if (verificationState === 'error' || verificationState === 'expired') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <ExclamationCircleIcon className="mx-auto h-12 w-12 text-red-500" />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {verificationState === 'expired' ? 'Verification link expired' : 'Verification failed'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {verificationState === 'expired' 
                ? 'This verification link has expired. Please request a new one.'
                : 'We couldn\'t verify your email address. The link may be invalid or expired.'
              }
            </p>
            {error && (
              <div className="mt-4 p-3 bg-red-50 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleResendVerification}
              loading={isResending}
              disabled={isResending}
              className="w-full"
            >
              {isResending ? 'Sending new link...' : 'Send new verification link'}
            </Button>
            
            <div className="text-center">
              <Link
                to={user ? ROUTES.DASHBOARD : ROUTES.LOGIN}
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                {user ? 'Go to Dashboard' : 'Back to Sign In'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pending verification state (no token provided)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {isLoading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
          ) : (
            <ClockIcon className="mx-auto h-12 w-12 text-yellow-500" />
          )}
          
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLoading ? 'Verifying your email...' : 'Verify your email address'}
          </h2>
          
          <p className="mt-2 text-sm text-gray-600">
            {isLoading 
              ? 'Please wait while we verify your email address.'
              : user 
                ? `We've sent a verification email to ${user.email}. Please check your inbox and click the verification link.`
                : 'Please check your email for a verification link.'
            }
          </p>
        </div>

        {!isLoading && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AcademicCapIcon className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Tips for finding your verification email:
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Check your spam or junk mail folder</li>
                      <li>Look for an email from our platform</li>
                      <li>Make sure you're checking the correct email account</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={handleResendVerification}
              loading={isResending}
              disabled={isResending}
              variant="outline"
              className="w-full"
            >
              {isResending ? 'Sending...' : 'Resend verification email'}
            </Button>
            
            <div className="text-center">
              <Link
                to={user ? ROUTES.DASHBOARD : ROUTES.LOGIN}
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                {user ? 'Go to Dashboard' : 'Back to Sign In'}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}