import React from 'react';
import { cn } from '@/shared/lib/utils';
import { motion } from 'framer-motion';
import FilterButton from '@/shared/ui/atoms/FilterButton';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

interface FilterGroupProps {
  options: FilterOption[];
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
  variant?: 'default' | 'pills' | 'tabs';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  allowMultiple?: boolean;
}

const FilterGroup = React.forwardRef<HTMLDivElement, FilterGroupProps>(
  ({
    options,
    selectedFilters,
    onFilterChange,
    variant = 'default',
    size = 'md',
    className,
    allowMultiple = true
  }, ref) => {
    const variants = {
      default: 'filter-group filter-group--default',
      pills: 'filter-group filter-group--pills',
      tabs: 'filter-group filter-group--tabs'
    };

    const handleFilterClick = (optionId: string) => {
      if (allowMultiple) {
        const newFilters = selectedFilters.includes(optionId)
          ? selectedFilters.filter(id => id !== optionId)
          : [...selectedFilters, optionId];
        onFilterChange(newFilters);
      } else {
        onFilterChange(selectedFilters.includes(optionId) ? [] : [optionId]);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(variants[variant], className)}
        role="group"
        aria-label="필터 옵션"
      >
        {options.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <FilterButton
              label={option.label}
              count={option.count}
              isActive={selectedFilters.includes(option.id)}
              onClick={() => handleFilterClick(option.id)}
              disabled={option.disabled}
              variant={variant === 'pills' ? 'pill' : 'default'}
              size={size}
            />
          </motion.div>
        ))}
      </div>
    );
  }
);

FilterGroup.displayName = 'FilterGroup';

export default FilterGroup;






