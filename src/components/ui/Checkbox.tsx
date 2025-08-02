import React, { forwardRef } from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';
import { cn } from '../../utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
  indeterminate?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, indeterminate = false, id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <div className="relative">
              <input
                id={checkboxId}
                type="checkbox"
                ref={ref}
                className={cn(
                  'h-4 w-4 rounded border-gray-300 transition-colors',
                  'text-primary-600 focus:ring-primary-500 focus:ring-offset-2',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  error && 'border-red-300 focus:ring-red-500',
                  'sr-only', // Hide default checkbox
                  className
                )}
                {...props}
              />
              
              {/* Custom checkbox appearance */}
              <div
                className={cn(
                  'absolute inset-0 h-4 w-4 rounded border transition-all duration-200',
                  'flex items-center justify-center',
                  props.checked || indeterminate
                    ? 'bg-primary-600 border-primary-600'
                    : 'bg-white border-gray-300 hover:border-gray-400',
                  error && !props.checked && !indeterminate && 'border-red-300',
                  props.disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {(props.checked || indeterminate) && (
                  <CheckIcon
                    className={cn(
                      'h-3 w-3 text-white',
                      indeterminate && 'opacity-60'
                    )}
                  />
                )}
              </div>
            </div>
          </div>
          
          {(label || description) && (
            <div className="ml-3 text-sm">
              {label && (
                <label 
                  htmlFor={checkboxId} 
                  className={cn(
                    'font-medium cursor-pointer',
                    error ? 'text-red-700' : 'text-gray-700',
                    props.disabled && 'cursor-not-allowed opacity-50'
                  )}
                >
                  {label}
                </label>
              )}
              {description && (
                <p className={cn(
                  'text-gray-500',
                  props.disabled && 'opacity-50'
                )}>
                  {description}
                </p>
              )}
            </div>
          )}
        </div>
        
        {error && (
          <div className="mt-1 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };