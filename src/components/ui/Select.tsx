import React, { forwardRef } from 'react';
import { ChevronDownIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { cn } from '../../utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    className, 
    label, 
    error, 
    helperText, 
    options, 
    placeholder = 'Select an option...',
    id,
    ...props 
  }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={selectId} 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          <select
            id={selectId}
            className={cn(
              'block w-full rounded-md border-gray-300 shadow-sm transition-colors',
              'focus:border-primary-500 focus:ring-primary-500',
              'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
              'pr-10 appearance-none bg-white',
              error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
              className
            )}
            ref={ref}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Custom dropdown arrow */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center pointer-events-none">
            {error ? (
              <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-1" />
            ) : null}
            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
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

Select.displayName = 'Select';

export { Select };