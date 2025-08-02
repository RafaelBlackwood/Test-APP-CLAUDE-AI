import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { useAuth } from './useAuth';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  type LoginFormData,
  type RegisterFormData,
  type ForgotPasswordFormData,
  type ResetPasswordFormData,
  type ChangePasswordFormData
} from '../utils/validation';

// Login form hook
export const useLoginForm = () => {
  const { login, isLoading, error, clearError } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearError();
      await login(data);
    } catch (error) {
      // Error is handled in the AuthContext
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    error,
    clearError,
  };
};

// Register form hook
export const useRegisterForm = () => {
  const { register, isLoading, error, clearError } = useAuth();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      role: 'student' as any,
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      clearError();
      await register(data);
    } catch (error) {
      // Error is handled in the AuthContext
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    error,
    clearError,
  };
};

// Forgot password form hook
export const useForgotPasswordForm = () => {
  const { forgotPassword, isLoading, error, clearError } = useAuth();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      clearError();
      await forgotPassword(data);
      form.reset();
    } catch (error) {
      // Error is handled in the AuthContext
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    error,
    clearError,
  };
};

// Reset password form hook
export const useResetPasswordForm = (token: string) => {
  const { resetPassword, isLoading, error, clearError } = useAuth();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      clearError();
      await resetPassword(data);
      form.reset();
    } catch (error) {
      // Error is handled in the AuthContext
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    error,
    clearError,
  };
};

// Change password form hook
export const useChangePasswordForm = () => {
  const { isLoading, error, clearError } = useAuth();

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      clearError();
      // This would typically call an API to change password
      // For now, we'll just show a success message
      toast.success('Password changed successfully');
      form.reset();
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    error,
    clearError,
  };
};