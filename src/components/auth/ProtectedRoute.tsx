import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { canAccessRoute } from '../../utils/auth';
import { ROUTES } from '../../constants';
import type { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  roles,
  fallback,
  redirectTo = ROUTES.LOGIN,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      )
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Check role-based access if roles are specified
  if (roles && !canAccessRoute(user, roles)) {
    // If user doesn't have required role, redirect to dashboard or show access denied
    if (user?.role === 'student') {
      return <Navigate to={ROUTES.DASHBOARD} replace />;
    } else if (user?.role === 'counselor') {
      return <Navigate to={ROUTES.DASHBOARD} replace />;
    } else {
      return <Navigate to={ROUTES.DASHBOARD} replace />;
    }
  }

  return <>{children}</>;
};

// Higher-order component for protecting routes
export const withProtectedRoute = <P extends object>(
  Component: React.ComponentType<P>,
  roles?: UserRole[]
) => {
  const ProtectedComponent: React.FC<P> = (props) => {
    return (
      <ProtectedRoute roles={roles}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };

  ProtectedComponent.displayName = `withProtectedRoute(${Component.displayName || Component.name})`;

  return ProtectedComponent;
};

// Component for showing access denied message
export const AccessDenied: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You don't have permission to access this page.
          </p>
          {user && (
            <p className="mt-1 text-xs text-gray-500">
              Current role: {user.role}
            </p>
          )}
        </div>
        <div>
          <button
            onClick={() => window.history.back()}
            className="btn btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};