import React, { forwardRef } from 'react';
import { EyeIcon, EyeSlashIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { cn } from '../../utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    label, 
    error, 
    helperText, 
    leftIcon, 
    rightIcon, 
    showPasswordToggle = false,
    id,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    const inputType = type === 'password' && showPassword ? 'text' : type;
    
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId} 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          
          <input
            id={inputId}
            type={inputType}
            className={cn(
              'block w-full rounded-md border-gray-300 shadow-sm transition-colors',
              'focus:border-primary-500 focus:ring-primary-500',
              'placeholder:text-gray-400',
              'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
              leftIcon && 'pl-10',
              (rightIcon || showPasswordToggle || error) && 'pr-10',
              error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
              className
            )}
            ref={ref}
            {...props}
          />
          
          {/* Right side icons */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {error && (
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            )}
            
            {showPasswordToggle && type === 'password' && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            )}
            
            {rightIcon && !showPasswordToggle && !error && (
              <div className="text-gray-400">
                {rightIcon}
              </div>
            )}
          </div>
        </div>
        
        {/* Helper text or error message */}
        {(error || helperText) && (
          <div className="mt-1 text-sm">
            {error ? (
              <span className="text-red-600">{error}</span>
            ) : (
              <span className="text-gray-500">{helperText}</span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };