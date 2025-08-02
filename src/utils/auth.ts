import { LOCAL_STORAGE_KEYS } from '../constants';
import type { AuthTokens, User } from '../types';

// Token Management
export const tokenManager = {
  // Store tokens
  setTokens: (tokens: AuthTokens): void => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, tokens.accessToken);
    localStorage.setItem('refresh_token', tokens.refreshToken);
    localStorage.setItem('token_expires_at', tokens.expiresAt.toString());
  },

  // Get access token
  getAccessToken: (): string | null => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
  },

  // Get refresh token
  getRefreshToken: (): string | null => {
    return localStorage.getItem('refresh_token');
  },

  // Get token expiration
  getTokenExpiration: (): number | null => {
    const expiresAt = localStorage.getItem('token_expires_at');
    return expiresAt ? parseInt(expiresAt, 10) : null;
  },

  // Check if token is expired
  isTokenExpired: (): boolean => {
    const expiresAt = tokenManager.getTokenExpiration();
    if (!expiresAt) return true;
    return Date.now() >= expiresAt;
  },

  // Check if token will expire soon (within 5 minutes)
  isTokenExpiringSoon: (): boolean => {
    const expiresAt = tokenManager.getTokenExpiration();
    if (!expiresAt) return true;
    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() >= (expiresAt - fiveMinutes);
  },

  // Clear all tokens
  clearTokens: (): void => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expires_at');
    localStorage.removeItem('user_data');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = tokenManager.getAccessToken();
    return token !== null && !tokenManager.isTokenExpired();
  }
};

// User Data Management
export const userManager = {
  // Store user data
  setUser: (user: User): void => {
    localStorage.setItem('user_data', JSON.stringify(user));
  },

  // Get user data
  getUser: (): User | null => {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },

  // Clear user data
  clearUser: (): void => {
    localStorage.removeItem('user_data');
  },

  // Update user data
  updateUser: (updates: Partial<User>): void => {
    const currentUser = userManager.getUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      userManager.setUser(updatedUser);
    }
  }
};

// JWT Token Parsing
export const parseJwtToken = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return null;
  }
};

// Extract user information from JWT token
export const getUserFromToken = (token: string): Partial<User> | null => {
  const payload = parseJwtToken(token);
  if (!payload) return null;

  return {
    id: payload.sub || payload.id,
    email: payload.email,
    firstName: payload.firstName || payload.first_name,
    lastName: payload.lastName || payload.last_name,
    role: payload.role,
    avatar: payload.avatar,
  };
};

// Role-based authorization helpers
export const hasRole = (user: User | null, requiredRole: string): boolean => {
  if (!user) return false;
  return user.role === requiredRole;
};

export const hasAnyRole = (user: User | null, requiredRoles: string[]): boolean => {
  if (!user) return false;
  return requiredRoles.includes(user.role);
};

export const isAdmin = (user: User | null): boolean => {
  return hasRole(user, 'admin');
};

export const isCounselor = (user: User | null): boolean => {
  return hasRole(user, 'counselor');
};

export const isStudent = (user: User | null): boolean => {
  return hasRole(user, 'student');
};

// Permission checking
export const canAccessRoute = (user: User | null, requiredRoles?: string[]): boolean => {
  if (!requiredRoles || requiredRoles.length === 0) {
    return true; // Public route
  }
  
  if (!user) {
    return false; // Protected route but no user
  }

  return hasAnyRole(user, requiredRoles);
};

// Session management
export const sessionManager = {
  // Start a new session
  startSession: (tokens: AuthTokens, user: User): void => {
    tokenManager.setTokens(tokens);
    userManager.setUser(user);
  },

  // End the current session
  endSession: (): void => {
    tokenManager.clearTokens();
    userManager.clearUser();
  },

  // Check if session is valid
  isSessionValid: (): boolean => {
    return tokenManager.isAuthenticated() && userManager.getUser() !== null;
  },

  // Get current session data
  getSessionData: () => {
    return {
      user: userManager.getUser(),
      isAuthenticated: tokenManager.isAuthenticated(),
      accessToken: tokenManager.getAccessToken(),
      refreshToken: tokenManager.getRefreshToken(),
    };
  }
};

// Password validation
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate secure random string
export const generateSecureRandomString = (length: number = 32): string => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return result;
};

// Format authentication error messages
export const formatAuthError = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  // Default error messages based on status codes
  const status = error?.response?.status;
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Invalid email or password.';
    case 403:
      return 'Access denied.';
    case 404:
      return 'User not found.';
    case 409:
      return 'An account with this email already exists.';
    case 422:
      return 'Validation error. Please check your input.';
    case 429:
      return 'Too many attempts. Please try again later.';
    case 500:
      return 'Server error. Please try again later.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};