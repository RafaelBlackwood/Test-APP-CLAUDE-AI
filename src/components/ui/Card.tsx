import React from 'react';
import { cn } from '../../utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>;
  Content: React.FC<CardContentProps>;
  Footer: React.FC<CardFooterProps>;
} = ({ 
  children, 
  variant = 'default', 
  padding = 'md',
  className, 
  ...props 
}) => {
  const variantClasses = {
    default: 'bg-white border border-gray-200 shadow-soft',
    elevated: 'bg-white shadow-medium border border-gray-100',
    outlined: 'bg-white border-2 border-gray-200',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(
        'rounded-xl',
        variantClasses[variant],
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader: React.FC<CardHeaderProps> = ({ children, className, ...props }) => (
  <div className={cn('mb-4', className)} {...props}>
    {children}
  </div>
);

const CardContent: React.FC<CardContentProps> = ({ children, className, ...props }) => (
  <div className={cn('', className)} {...props}>
    {children}
  </div>
);

const CardFooter: React.FC<CardFooterProps> = ({ children, className, ...props }) => (
  <div className={cn('mt-4 pt-4 border-t border-gray-100', className)} {...props}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;