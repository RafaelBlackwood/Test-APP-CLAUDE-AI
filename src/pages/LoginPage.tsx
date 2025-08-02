import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AcademicCapIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Controller } from 'react-hook-form';
import { Input } from '../components/ui/Input';
import { Checkbox } from '../components/ui/Checkbox';
import { Button } from '../components/ui/Button';
import { SocialAuthButtons } from '../components/auth/SocialAuthButtons';
import { useLoginForm } from '../hooks/useAuthForm';
import { useGuestGuard } from '../hooks/useAuthGuard';
import { ROUTES, APP_NAME } from '../constants';

export function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useGuestGuard();
  const { form, onSubmit, isLoading, error, clearError } = useLoginForm();

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <div className="flex justify-center">
            <AcademicCapIcon className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to={ROUTES.REGISTER}
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              create a new account
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
              <span className="px-2 bg-gray-50 text-gray-500">Continue with</span>
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
              <span className="px-2 bg-gray-50 text-gray-500">Or continue with email</span>
            </div>
          </div>
        </div>

        {/* Login Form */}
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
                    Sign in failed
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

            {/* Password Field */}
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  label="Password"
                  placeholder="Enter your password"
                  showPasswordToggle
                  error={errors.password?.message}
                />
              )}
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <Controller
              name="rememberMe"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Checkbox
                  id="remember-me"
                  checked={value}
                  onChange={onChange}
                  label="Remember me"
                />
              )}
            />

            <div className="text-sm">
              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              loading={isLoading}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>

        {/* Additional Links */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to={ROUTES.REGISTER}
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}