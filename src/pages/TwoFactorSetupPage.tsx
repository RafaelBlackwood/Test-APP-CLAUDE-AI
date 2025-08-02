import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheckIcon, 
  QrCodeIcon, 
  KeyIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useAuthGuard } from '../hooks/useAuthGuard';
import { twoFactorVerificationSchema, type TwoFactorVerificationFormData } from '../utils/validation';
import { ROUTES } from '../constants';
import type { TwoFactorSetup } from '../types';

export function TwoFactorSetupPage() {
  const navigate = useNavigate();
  const { user, setupTwoFactor, verifyTwoFactor, isLoading } = useAuth();
  const { isAuthenticated } = useAuthGuard();
  
  const [setupData, setSetupData] = useState<TwoFactorSetup | null>(null);
  const [currentStep, setCurrentStep] = useState<'setup' | 'verify' | 'success'>('setup');
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const form = useForm<TwoFactorVerificationFormData>({
    resolver: zodResolver(twoFactorVerificationSchema),
    defaultValues: {
      code: '',
    },
  });

  const { control, handleSubmit, formState: { errors }, reset } = form;

  // Initialize 2FA setup on mount
  useEffect(() => {
    if (isAuthenticated && currentStep === 'setup') {
      initializeTwoFactor();
    }
  }, [isAuthenticated, currentStep]);

  const initializeTwoFactor = async () => {
    try {
      setError(null);
      const data = await setupTwoFactor();
      setSetupData(data);
      setCurrentStep('verify');
    } catch (error: any) {
      setError(error.message || 'Failed to initialize two-factor authentication');
    }
  };

  const handleVerifyCode = async (data: TwoFactorVerificationFormData) => {
    try {
      setError(null);
      await verifyTwoFactor({ code: data.code });
      setCurrentStep('success');
      reset();
    } catch (error: any) {
      setError(error.message || 'Invalid verification code');
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(type);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handleContinue = () => {
    navigate(ROUTES.SETTINGS);
  };

  // Loading state
  if (isLoading && currentStep === 'setup') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Success state
  if (currentStep === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Two-factor authentication enabled!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your account is now protected with two-factor authentication. 
              You'll need to enter a code from your authenticator app each time you sign in.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ShieldCheckIcon className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Security tip
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  Save your backup codes in a secure location. You can use them to access your account if you lose your phone.
                </div>
              </div>
            </div>
          </div>

          <Button onClick={handleContinue} className="w-full">
            Continue to Settings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <ShieldCheckIcon className="mx-auto h-12 w-12 text-primary-600" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Set up two-factor authentication
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Add an extra layer of security to your account
          </p>
        </div>

        {currentStep === 'setup' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ShieldCheckIcon className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Before you start
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>You'll need an authenticator app on your phone such as:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Google Authenticator</li>
                      <li>Microsoft Authenticator</li>
                      <li>Authy</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={initializeTwoFactor}
              loading={isLoading}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Setting up...' : 'Begin Setup'}
            </Button>
          </div>
        )}

        {currentStep === 'verify' && setupData && (
          <div className="space-y-6">
            {/* Global Error */}
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Verification failed
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      {error}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Scan QR Code */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <QrCodeIcon className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Step 1: Scan QR Code</h3>
              </div>
              
              <div className="text-center mb-4">
                <div className="inline-block p-4 bg-white border-2 border-gray-300 rounded-lg">
                  <img
                    src={setupData.qrCode}
                    alt="QR Code for 2FA setup"
                    className="w-32 h-32"
                  />
                </div>
              </div>
              
              <p className="text-sm text-gray-600 text-center">
                Open your authenticator app and scan this QR code
              </p>
            </div>

            {/* Step 2: Manual Entry (Alternative) */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <KeyIcon className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Alternative: Manual Entry</h3>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">
                If you can't scan the QR code, enter this secret key manually:
              </p>
              
              <div className="flex items-center space-x-2">
                <code className="flex-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded text-sm font-mono">
                  {setupData.secret}
                </code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(setupData.secret, 'secret')}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  title="Copy to clipboard"
                >
                  <ClipboardDocumentIcon className="h-5 w-5" />
                </button>
              </div>
              
              {copiedCode === 'secret' && (
                <p className="text-xs text-green-600 mt-1">Copied to clipboard!</p>
              )}
            </div>

            {/* Step 3: Verify */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <CheckCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Step 2: Verify Setup</h3>
              </div>
              
              <form onSubmit={handleSubmit(handleVerifyCode)} className="space-y-4">
                <Controller
                  name="code"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="code"
                      type="text"
                      label="Verification code"
                      placeholder="Enter 6-digit code"
                      error={errors.code?.message}
                      helperText="Enter the 6-digit code from your authenticator app"
                      maxLength={6}
                    />
                  )}
                />

                <Button
                  type="submit"
                  loading={isLoading}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Verifying...' : 'Verify and Enable'}
                </Button>
              </form>
            </div>

            {/* Backup Codes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <KeyIcon className="h-5 w-5 text-yellow-400 mr-2" />
                <h3 className="text-lg font-medium text-yellow-800">Backup Codes</h3>
              </div>
              
              <p className="text-sm text-yellow-700 mb-3">
                Save these backup codes in a secure location. You can use them to access your account if you lose your phone:
              </p>
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                {setupData.backupCodes.map((code, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <code className="flex-1 px-2 py-1 bg-yellow-100 border border-yellow-300 rounded text-xs font-mono">
                      {code}
                    </code>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(code, `backup-${index}`)}
                      className="p-1 text-yellow-600 hover:text-yellow-800"
                      title="Copy code"
                    >
                      <ClipboardDocumentIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              {copiedCode?.startsWith('backup-') && (
                <p className="text-xs text-green-600">Backup code copied!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}