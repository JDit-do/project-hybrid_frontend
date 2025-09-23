import React from 'react';
import { cn } from '@/shared/lib/utils';
import { motion } from 'framer-motion';

interface FilterButtonProps {
  label: string;
  count?: number;
  isActive?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

const FilterButton = React.forwardRef<HTMLButtonElement, FilterButtonProps>(
  ({
    label,
    count,
    isActive = false,
    onClick,
    variant = 'default',
    size = 'md',
    className,
    disabled = false,
    ...props
  }, ref) => {
    const variants = {
      default: 'filter-button filter-button--default',
      outline: 'filter-button filter-button--outline',
      ghost: 'filter-button filter-button--ghost',
      pill: 'filter-button filter-button--pill'
    };

    const sizes = {
      sm: 'filter-button--sm',
      md: 'filter-button--md',
      lg: 'filter-button--lg'
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          variants[variant],
          sizes[size],
          isActive && 'filter-button--active',
          disabled && 'filter-button--disabled',
          className
        )}
        onClick={onClick}
        disabled={disabled}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        {...props}
      >
        <span className="filter-button__label">{label}</span>
        {count !== undefined && (
          <span className="filter-button__count">{count}</span>
        )}
      </motion.button>
    );
  }
);

FilterButton.displayName = 'FilterButton';

export default FilterButton;






