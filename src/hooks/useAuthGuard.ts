import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { hasAnyRole, canAccessRoute } from '../utils/auth';
import { ROUTES } from '../constants';
import type { UserRole } from '../types';

// Hook to protect routes that require authentication
export const useAuthGuard = (requiredRoles?: UserRole[]) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    // If not authenticated and trying to access protected route
    if (!isAuthenticated && requiredRoles) {
      navigate(ROUTES.LOGIN, { 
        state: { from: location.pathname },
        replace: true 
      });
      return;
    }

    // If authenticated but doesn't have required role
    if (isAuthenticated && requiredRoles && !canAccessRoute(user, requiredRoles)) {
      navigate(ROUTES.DASHBOARD, { replace: true });
      return;
    }
  }, [isAuthenticated, isLoading, user, requiredRoles, navigate, location]);

  return {
    isAuthenticated,
    isLoading,
    hasAccess: canAccessRoute(user, requiredRoles),
    user,
  };
};

// Hook to redirect authenticated users away from auth pages
export const useGuestGuard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Get the intended destination from state, or default to dashboard
      const from = (location.state as any)?.from || ROUTES.DASHBOARD;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  return {
    isAuthenticated,
    isLoading,
  };
};

// Hook for role-based access control
export const useRoleGuard = (allowedRoles: UserRole[]) => {
  const { user, isAuthenticated } = useAuth();

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyAllowedRole = (): boolean => {
    return hasAnyRole(user, allowedRoles);
  };

  const isAdmin = (): boolean => {
    return hasRole('admin' as UserRole);
  };

  const isCounselor = (): boolean => {
    return hasRole('counselor' as UserRole);
  };

  const isStudent = (): boolean => {
    return hasRole('student' as UserRole);
  };

  return {
    user,
    isAuthenticated,
    hasRole,
    hasAnyAllowedRole,
    isAdmin,
    isCounselor,
    isStudent,
    canAccess: isAuthenticated && hasAnyAllowedRole(),
  };
};

// Hook for conditional rendering based on permissions
export const usePermissions = () => {
  const { user, isAuthenticated } = useAuth();

  const can = (permission: string): boolean => {
    if (!isAuthenticated || !user) return false;

    // Define role-based permissions
    const permissions: Record<string, UserRole[]> = {
      'view:dashboard': ['student', 'counselor', 'admin'],
      'view:applications': ['student', 'counselor', 'admin'],
      'create:application': ['student'],
      'edit:application': ['student'],
      'delete:application': ['student'],
      'view:all_applications': ['counselor', 'admin'],
      'manage:universities': ['admin'],
      'manage:users': ['admin'],
      'view:analytics': ['counselor', 'admin'],
      'manage:system': ['admin'],
    };

    const allowedRoles = permissions[permission] || [];
    return allowedRoles.includes(user.role);
  };

  const canAny = (permissions: string[]): boolean => {
    return permissions.some(permission => can(permission));
  };

  const canAll = (permissions: string[]): boolean => {
    return permissions.every(permission => can(permission));
  };

  return {
    can,
    canAny,
    canAll,
    user,
    isAuthenticated,
  };
};