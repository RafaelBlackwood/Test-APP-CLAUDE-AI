import React from 'react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

// Social provider configurations
const socialProviders = [
  {
    id: 'google',
    name: 'Google',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    ),
    bgColor: 'bg-white',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-300',
    hoverBg: 'hover:bg-gray-50',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    bgColor: 'bg-blue-600',
    textColor: 'text-white',
    borderColor: 'border-blue-600',
    hoverBg: 'hover:bg-blue-700',
  },
  {
    id: 'apple',
    name: 'Apple',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.017 0C8.396 0 8.086.014 6.878.072 5.671.13 4.865.333 4.17.63c-.74.32-1.3.561-1.85 1.1C1.76 2.184 1.52 2.744 1.2 3.484c-.297.695-.5 1.501-.558 2.708C.584 7.4.57 7.71.57 11.331s.014 3.931.072 5.139c.058 1.207.261 2.013.558 2.708.32.74.561 1.3 1.1 1.85.55.54 1.11.781 1.85 1.101.695.297 1.501.5 2.708.558 1.208.058 1.518.072 5.139.072s3.931-.014 5.139-.072c1.207-.058 2.013-.261 2.708-.558.74-.32 1.3-.561 1.85-1.101.54-.55.781-1.11 1.101-1.85.297-.695.5-1.501.558-2.708.058-1.208.072-1.518.072-5.139s-.014-3.931-.072-5.139c-.058-1.207-.261-2.013-.558-2.708-.32-.74-.561-1.3-1.101-1.85C20.45 1.321 19.89 1.08 19.15.76c-.695-.297-1.501-.5-2.708-.558C15.234.014 14.924 0 11.303 0h.714zm1.186 2.314c.38-.001.801-.002 1.337-.002 3.568 0 3.987.015 5.39.071 1.3.059 2.006.277 2.477.459.623.242 1.067.532 1.534.999.467.467.757.911.999 1.534.182.471.4 1.177.459 2.477.056 1.403.071 1.822.071 5.39s-.015 3.987-.071 5.39c-.059 1.3-.277 2.006-.459 2.477-.242.623-.532 1.067-.999 1.534-.467.467-.911.757-1.534.999-.471.182-1.177.4-2.477.459-1.403.056-1.822.071-5.39.071s-3.987-.015-5.39-.071c-1.3-.059-2.006-.277-2.477-.459-.623-.242-1.067-.532-1.534-.999-.467-.467-.757-.911-.999-1.534-.182-.471-.4-1.177-.459-2.477-.056-1.403-.071-1.822-.071-5.39s.015-3.987.071-5.39c.059-1.3.277-2.006.459-2.477.242-.623.532-1.067.999-1.534.467-.467.911-.757 1.534-.999.471-.182 1.177-.4 2.477-.459 1.226-.056 1.7-.07 4.053-.071v.001zm8.07 2.129c-.884 0-1.601.717-1.601 1.601s.717 1.601 1.601 1.601 1.601-.717 1.601-1.601-.717-1.601-1.601-1.601zm-4.423 1.16c-3.729 0-6.752 3.023-6.752 6.752s3.023 6.752 6.752 6.752 6.752-3.023 6.752-6.752-3.023-6.752-6.752-6.752zm0 2.432c2.379 0 4.32 1.941 4.32 4.32s-1.941 4.32-4.32 4.32-4.32-1.941-4.32-4.32 1.941-4.32 4.32-4.32z" />
      </svg>
    ),
    bgColor: 'bg-black',
    textColor: 'text-white',
    borderColor: 'border-black',
    hoverBg: 'hover:bg-gray-800',
  },
];

interface SocialAuthButtonsProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
  onSuccess,
  onError,
}) => {
  const { loginWithGoogle, loginWithFacebook, loginWithApple, isLoading } = useAuth();

  const handleSocialLogin = async (providerId: string) => {
    try {
      switch (providerId) {
        case 'google':
          await loginWithGoogle();
          break;
        case 'facebook':
          await loginWithFacebook();
          break;
        case 'apple':
          await loginWithApple();
          break;
        default:
          throw new Error('Unsupported provider');
      }
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Social login failed';
      onError?.(errorMessage);
    }
  };

  return (
    <div className="space-y-3">
      {socialProviders.map((provider) => (
        <button
          key={provider.id}
          type="button"
          disabled={isLoading}
          onClick={() => handleSocialLogin(provider.id)}
          className={`
            w-full flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium transition-colors
            ${provider.bgColor} ${provider.textColor} ${provider.borderColor} ${provider.hoverBg}
            disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
          `}
        >
          <span className="mr-3">{provider.icon}</span>
          Continue with {provider.name}
        </button>
      ))}
    </div>
  );
};

// Individual social auth button component
interface SocialAuthButtonProps {
  provider: 'google' | 'facebook' | 'apple';
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

export const SocialAuthButton: React.FC<SocialAuthButtonProps> = ({
  provider,
  children,
  disabled = false,
  onClick,
}) => {
  const { loginWithGoogle, loginWithFacebook, loginWithApple, isLoading } = useAuth();

  const providerConfig = socialProviders.find(p => p.id === provider);
  
  if (!providerConfig) {
    return null;
  }

  const handleClick = async () => {
    if (onClick) {
      onClick();
      return;
    }

    try {
      switch (provider) {
        case 'google':
          await loginWithGoogle();
          break;
        case 'facebook':
          await loginWithFacebook();
          break;
        case 'apple':
          await loginWithApple();
          break;
      }
    } catch (error) {
      console.error(`${provider} login failed:`, error);
    }
  };

  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      onClick={handleClick}
      className={`
        flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium transition-colors
        ${providerConfig.bgColor} ${providerConfig.textColor} ${providerConfig.borderColor} ${providerConfig.hoverBg}
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
      `}
    >
      <span className="mr-2">{providerConfig.icon}</span>
      {children || `Continue with ${providerConfig.name}`}
    </button>
  );
};