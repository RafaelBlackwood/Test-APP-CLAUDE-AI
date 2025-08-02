import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AcademicCapIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Controller } from 'react-hook-form';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Checkbox } from '../components/ui/Checkbox';
import { Button } from '../components/ui/Button';
import { SocialAuthButtons } from '../components/auth/SocialAuthButtons';
import { useRegisterForm } from '../hooks/useAuthForm';
import { useGuestGuard } from '../hooks/useAuthGuard';
import { ROUTES, USER_ROLE_LABELS } from '../constants';
import { UserRole } from '../types';

export function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useGuestGuard();
  const { form, onSubmit, isLoading, error, clearError } = useRegisterForm();

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

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const roleOptions = Object.entries(USER_ROLE_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <div className="flex justify-center">
            <AcademicCapIcon className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to={ROUTES.LOGIN}
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Social Authentication */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Sign up with</span>
            </div>
          </div>
          
          <div className="mt-6">
            <SocialAuthButtons 
              onSuccess={() => navigate(ROUTES.DASHBOARD)}
              onError={(error) => console.error('Social auth error:', error)}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or register with email</span>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          {/* Global Error */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Registration failed
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="firstName"
                    type="text"
                    autoComplete="given-name"
                    label="First name"
                    placeholder="Enter your first name"
                    error={errors.firstName?.message}
                  />
                )}
              />

              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="lastName"
                    type="text"
                    autoComplete="family-name"
                    label="Last name"
                    placeholder="Enter your last name"
                    error={errors.lastName?.message}
                  />
                )}
              />
            </div>

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

            {/* Role Selection */}
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  id="role"
                  label="I am a"
                  placeholder="Select your role"
                  options={roleOptions}
                  error={errors.role?.message}
                />
              )}
            />

            {/* Password Fields */}
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  label="Password"
                  placeholder="Create a password"
                  showPasswordToggle
                  error={errors.password?.message}
                  helperText="Must be at least 8 characters with uppercase, lowercase, number, and special character"
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  label="Confirm password"
                  placeholder="Confirm your password"
                  showPasswordToggle
                  error={errors.confirmPassword?.message}
                />
              )}
            />
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-4">
            <Controller
              name="acceptTerms"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Checkbox
                  id="acceptTerms"
                  checked={value}
                  onChange={onChange}
                  error={errors.acceptTerms?.message}
                  label={
                    <span className="text-sm text-gray-700">
                      I agree to the{' '}
                      <Link
                        to={ROUTES.TERMS}
                        className="font-medium text-primary-600 hover:text-primary-500"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link
                        to={ROUTES.PRIVACY}
                        className="font-medium text-primary-600 hover:text-primary-500"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Privacy Policy
                      </Link>
                    </span>
                  }
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
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </div>
        </form>

        {/* Additional Information */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            By creating an account, you'll be able to track your university applications,
            save your favorite schools, and get personalized recommendations.
          </p>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to={ROUTES.LOGIN}
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}