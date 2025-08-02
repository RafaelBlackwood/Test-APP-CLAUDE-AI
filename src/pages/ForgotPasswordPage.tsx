import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AcademicCapIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Controller } from 'react-hook-form';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useForgotPasswordForm } from '../hooks/useAuthForm';
import { useGuestGuard } from '../hooks/useAuthGuard';
import { ROUTES } from '../constants';

export function ForgotPasswordPage() {
  const { isAuthenticated, isLoading: authLoading } = useGuestGuard();
  const { form, onSubmit, isLoading, error, clearError } = useForgotPasswordForm();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    control,
    formState: { errors },
    watch,
    getValues,
  } = form;

  // Clear error when form values change
  useEffect(() => {
    const subscription = watch(() => {
      if (error) {
        clearError();
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, error, clearError]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const handleSubmit = async (data: any) => {
    try {
      await onSubmit(data);
      setIsSuccess(true);
    } catch (error) {
      // Error handled in hook
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Check your email
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We've sent a password reset link to{' '}
              <span className="font-medium">{getValues('email')}</span>
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={() => setIsSuccess(false)}
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                try again
              </button>
            </p>
          </div>
          
          <div className="text-center">
            <Link
              to={ROUTES.LOGIN}
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <div className="flex justify-center">
            <AcademicCapIcon className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Reset Form */}
        <form className="mt-8 space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
          {/* Global Error */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Reset failed
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Email Field */}
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="email"
                  type="email"
                  autoComplete="email"
                  label="Email address"
                  placeholder="Enter your email"
                  error={errors.email?.message}
                />
              )}
            />
          </div>

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              loading={isLoading}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Sending reset link...' : 'Send reset link'}
            </Button>
          </div>
        </form>

        {/* Back to Login */}
        <div className="text-center">
          <Link
            to={ROUTES.LOGIN}
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}