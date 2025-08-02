import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils';

interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  animated = true,
  className,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variantClasses = {
    default: 'bg-gray-500',
    primary: 'bg-primary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">{Math.round(percentage)}%</span>
        </div>
      )}
      
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizeClasses[size])}>
        {animated ? (
          <motion.div
            className={cn('h-full rounded-full', variantClasses[variant])}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        ) : (
          <div
            className={cn('h-full rounded-full transition-all duration-300', variantClasses[variant])}
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
    </div>
  );
};

export default Progress;