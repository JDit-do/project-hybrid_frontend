import React from 'react';
import { cn } from '@/shared/lib/utils';
import { motion } from 'framer-motion';
import { Grid3X3, List, LayoutGrid } from 'lucide-react';

interface ViewToggleProps {
  viewMode: 'grid' | 'list' | 'masonry';
  onViewModeChange: (mode: 'grid' | 'list' | 'masonry') => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ViewToggle = React.forwardRef<HTMLDivElement, ViewToggleProps>(
  ({ viewMode, onViewModeChange, className, size = 'md' }, ref) => {
    const sizes = {
      sm: 'view-toggle--sm',
      md: 'view-toggle--md',
      lg: 'view-toggle--lg'
    };

    const buttons = [
      { mode: 'grid' as const, icon: Grid3X3, label: '그리드 보기' },
      { mode: 'list' as const, icon: List, label: '리스트 보기' },
      { mode: 'masonry' as const, icon: LayoutGrid, label: '매이슨리 보기' }
    ];

    return (
      <div
        ref={ref}
        className={cn('view-toggle', sizes[size], className)}
        role="group"
        aria-label="보기 모드 선택"
      >
        {buttons.map(({ mode, icon: Icon, label }) => (
          <motion.button
            key={mode}
            className={cn(
              'view-toggle__button',
              viewMode === mode && 'view-toggle__button--active'
            )}
            onClick={() => onViewModeChange(mode)}
            aria-label={label}
            aria-pressed={viewMode === mode}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <Icon className="view-toggle__icon" />
          </motion.button>
        ))}
      </div>
    );
  }
);

ViewToggle.displayName = 'ViewToggle';

export default ViewToggle;






