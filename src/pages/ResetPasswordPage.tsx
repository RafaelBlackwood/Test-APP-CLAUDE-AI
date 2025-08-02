import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { AcademicCapIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Controller } from 'react-hook-form';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useResetPasswordForm } from '../hooks/useAuthForm';
import { useGuestGuard } from '../hooks/useAuthGuard';
import { ROUTES } from '../constants';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  
  const { isAuthenticated, isLoading: authLoading } = useGuestGuard();
  const { form, onSubmit, isLoading, error, clearError } = useResetPasswordForm(token);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    control,
    formState: { errors },
    watch,
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

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      navigate(ROUTES.FORGOT_PASSWORD);
    }
  }, [token, navigate]);

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
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 3000);
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
              Password reset successful
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Redirecting to sign in page in 3 seconds...
            </p>
          </div>
          
          <div className="text-center">
            <Link
              to={ROUTES.LOGIN}
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Continue to sign in
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
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below.
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
                    Password reset failed
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Password Field */}
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  label="New password"
                  placeholder="Enter your new password"
                  showPasswordToggle
                  error={errors.password?.message}
                  helperText="Must be at least 8 characters with uppercase, lowercase, number, and special character"
                />
              )}
            />

            {/* Confirm Password Field */}
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  label="Confirm new password"
                  placeholder="Confirm your new password"
                  showPasswordToggle
                  error={errors.confirmPassword?.message}
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
              {isLoading ? 'Resetting password...' : 'Reset password'}
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