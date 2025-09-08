import React from 'react';
import { cn } from '@/shared/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'glass' | 'modern';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, disabled, children, ...props }, ref) => {
    const baseClasses = 'button';
    
    const variants = {
      primary: 'button--primary',
      secondary: 'button--secondary',
      outline: 'button--outline',
      ghost: 'button--ghost',
      gradient: 'button--gradient',
      glass: 'button--glass',
      modern: 'button--modern'
    };
    
    const sizes = {
      xs: 'button--xs',
      sm: 'button--sm',
      md: 'button--md',
      lg: 'button--lg',
      xl: 'button--xl'
    };

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <div className="button__spinner">
            <div className="loading" />
          </div>
        )}
        
        <span className={cn("button__content", loading && "button__content--loading")}>
          {children}
        </span>
      </button>
    );
  }
);
Button.displayName = 'Button';
export default Button;