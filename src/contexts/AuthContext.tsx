import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import type { 
  AuthContextType, 
  AuthState, 
  User, 
  LoginCredentials, 
  RegisterData,
  TwoFactorSetup,
  TwoFactorVerification,
  PasswordResetRequest,
  PasswordReset,
  EmailVerification,
  AuthTokens
} from '../types';
import { tokenManager, userManager, sessionManager, formatAuthError } from '../utils/auth';
import { authService } from '../services/api';

// Auth Actions
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGOUT' };

// Auth Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: action.payload !== null,
        isLoading: false,
        error: null
      };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    default:
      return state;
  }
};

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: React.ReactNode;
}

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });

        // Check if user is authenticated
        if (sessionManager.isSessionValid()) {
          const sessionData = sessionManager.getSessionData();
          
          // Check if token needs refresh
          if (tokenManager.isTokenExpiringSoon()) {
            await refreshToken();
          } else {
            dispatch({ type: 'SET_USER', payload: sessionData.user });
          }
        } else {
          // Clear any invalid session data
          sessionManager.endSession();
          dispatch({ type: 'SET_USER', payload: null });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        sessionManager.endSession();
        dispatch({ type: 'SET_USER', payload: null });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await authService.login(credentials.email, credentials.password);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Login failed');
      }

      const { user, tokens } = response.data;
      
      // Store session data
      sessionManager.startSession(tokens, user);
      
      // Update state
      dispatch({ type: 'SET_USER', payload: user });
      
      toast.success('Welcome back!');
    } catch (error) {
      const errorMessage = formatAuthError(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Register function
  const register = useCallback(async (data: RegisterData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await authService.register(data);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Registration failed');
      }

      const { user, tokens } = response.data;
      
      // Store session data
      sessionManager.startSession(tokens, user);
      
      // Update state
      dispatch({ type: 'SET_USER', payload: user });
      
      toast.success('Account created successfully!');
    } catch (error) {
      const errorMessage = formatAuthError(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Call logout API
      await authService.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always clear local session regardless of API response
      sessionManager.endSession();
      dispatch({ type: 'LOGOUT' });
      toast.success('You have been logged out');
    }
  }, []);

  // Update profile function
  const updateProfile = useCallback(async (updates: Partial<User>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await authService.updateProfile(updates);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Profile update failed');
      }

      const updatedUser = response.data;
      
      // Update stored user data
      userManager.setUser(updatedUser);
      
      // Update state
      dispatch({ type: 'SET_USER', payload: updatedUser });
      
      toast.success('Profile updated successfully');
    } catch (error) {
      const errorMessage = formatAuthError(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Refresh token function
  const refreshToken = useCallback(async () => {
    try {
      const response = await authService.refreshToken();
      
      if (!response.success || !response.data) {
        throw new Error('Token refresh failed');
      }

      const { tokens, user } = response.data;
      
      // Update stored tokens
      tokenManager.setTokens(tokens);
      
      if (user) {
        userManager.setUser(user);
        dispatch({ type: 'SET_USER', payload: user });
      }
      
      return tokens;
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, logout user
      sessionManager.endSession();
      dispatch({ type: 'LOGOUT' });
      throw error;
    }
  }, []);

  // Social auth functions (mock implementations)
  const loginWithGoogle = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Mock Google OAuth flow
      toast.loading('Redirecting to Google...', { duration: 2000 });
      
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful login
      const mockUser: User = {
        id: 'google-user-1',
        email: 'user@gmail.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'student' as any,
        avatar: 'https://via.placeholder.com/150',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockTokens: AuthTokens = {
        accessToken: 'mock-google-access-token',
        refreshToken: 'mock-google-refresh-token',
        expiresAt: Date.now() + 3600000, // 1 hour
      };

      sessionManager.startSession(mockTokens, mockUser);
      dispatch({ type: 'SET_USER', payload: mockUser });
      
      toast.success('Signed in with Google successfully!');
    } catch (error) {
      const errorMessage = formatAuthError(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const loginWithFacebook = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      toast.loading('Redirecting to Facebook...', { duration: 2000 });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockUser: User = {
        id: 'facebook-user-1',
        email: 'user@facebook.com',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'student' as any,
        avatar: 'https://via.placeholder.com/150',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockTokens: AuthTokens = {
        accessToken: 'mock-facebook-access-token',
        refreshToken: 'mock-facebook-refresh-token',
        expiresAt: Date.now() + 3600000,
      };

      sessionManager.startSession(mockTokens, mockUser);
      dispatch({ type: 'SET_USER', payload: mockUser });
      
      toast.success('Signed in with Facebook successfully!');
    } catch (error) {
      const errorMessage = formatAuthError(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const loginWithApple = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      toast.loading('Redirecting to Apple...', { duration: 2000 });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockUser: User = {
        id: 'apple-user-1',
        email: 'user@icloud.com',
        firstName: 'Alex',
        lastName: 'Johnson',
        role: 'student' as any,
        avatar: 'https://via.placeholder.com/150',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockTokens: AuthTokens = {
        accessToken: 'mock-apple-access-token',
        refreshToken: 'mock-apple-refresh-token',
        expiresAt: Date.now() + 3600000,
      };

      sessionManager.startSession(mockTokens, mockUser);
      dispatch({ type: 'SET_USER', payload: mockUser });
      
      toast.success('Signed in with Apple successfully!');
    } catch (error) {
      const errorMessage = formatAuthError(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Two-factor auth functions (mock implementations)
  const setupTwoFactor = useCallback(async (): Promise<TwoFactorSetup> => {
    try {
      // Mock 2FA setup
      const mockSetup: TwoFactorSetup = {
        secret: 'JBSWY3DPEHPK3PXP',
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
        backupCodes: [
          '12345678',
          '87654321',
          '11111111',
          '22222222',
          '33333333',
        ],
      };
      
      toast.success('Two-factor authentication setup initiated');
      return mockSetup;
    } catch (error) {
      const errorMessage = formatAuthError(error);
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  const verifyTwoFactor = useCallback(async (verification: TwoFactorVerification) => {
    try {
      // Mock verification
      if (verification.code === '123456' || verification.backupCode === '12345678') {
        toast.success('Two-factor authentication verified successfully');
      } else {
        throw new Error('Invalid verification code');
      }
    } catch (error) {
      const errorMessage = formatAuthError(error);
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  const disableTwoFactor = useCallback(async () => {
    try {
      // Mock disable 2FA
      toast.success('Two-factor authentication disabled');
    } catch (error) {
      const errorMessage = formatAuthError(error);
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  // Password reset functions
  const forgotPassword = useCallback(async (request: PasswordResetRequest) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await authService.forgotPassword(request.email);
      
      if (!response.success) {
        throw new Error(response.message || 'Password reset request failed');
      }
      
      toast.success('Password reset email sent. Please check your inbox.');
    } catch (error) {
      const errorMessage = formatAuthError(error);
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const resetPassword = useCallback(async (reset: PasswordReset) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await authService.resetPassword(reset.token, reset.password);
      
      if (!response.success) {
        throw new Error(response.message || 'Password reset failed');
      }
      
      toast.success('Password reset successfully. You can now sign in with your new password.');
    } catch (error) {
      const errorMessage = formatAuthError(error);
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Email verification functions
  const verifyEmail = useCallback(async (verification: EmailVerification) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Mock email verification
      toast.success('Email verified successfully!');
      
      // Update user state to mark email as verified
      if (state.user) {
        const updatedUser = { ...state.user };
        userManager.setUser(updatedUser);
        dispatch({ type: 'SET_USER', payload: updatedUser });
      }
    } catch (error) {
      const errorMessage = formatAuthError(error);
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.user]);

  const resendVerificationEmail = useCallback(async () => {
    try {
      // Mock resend verification email
      toast.success('Verification email sent. Please check your inbox.');
    } catch (error) {
      const errorMessage = formatAuthError(error);
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  // Context value
  const value: AuthContextType = {
    // State
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    login,
    register,
    logout,
    updateProfile,
    refreshToken,
    clearError,
    
    // Social Auth
    loginWithGoogle,
    loginWithFacebook,
    loginWithApple,
    
    // Two Factor Auth
    setupTwoFactor,
    verifyTwoFactor,
    disableTwoFactor,
    
    // Password Reset
    forgotPassword,
    resetPassword,
    
    // Email Verification
    verifyEmail,
    resendVerificationEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;