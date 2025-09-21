import React from 'react';
import { cn } from '@/shared/lib/utils';

interface ImageGridEmptyProps {
  className?: string;
}

const ImageGridEmpty = React.forwardRef<HTMLDivElement, ImageGridEmptyProps>(
  ({ className }, ref) => {
    return (
      <div ref={ref} className={cn('image-grid__empty', className)}>
        <div className="image-grid__empty-content">
          <div className="image-grid__empty-icon">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="image-grid__empty-title">이미지가 없습니다</h3>
          <p className="image-grid__empty-description">아직 업로드된 이미지가 없습니다.</p>
        </div>
      </div>
    );
  }
);

ImageGridEmpty.displayName = 'ImageGridEmpty';

export default ImageGridEmpty;


