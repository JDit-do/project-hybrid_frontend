import React from 'react';
import { cn } from '@/shared/lib/utils';

interface DashboardEmptyProps {
  className?: string;
  onUploadClick?: () => void;
}

const DashboardEmpty = React.forwardRef<HTMLDivElement, DashboardEmptyProps>(
  ({ className, onUploadClick }, ref) => {
    return (
      <div ref={ref} className={cn('dashboard-empty', className)}>
        <div className="dashboard-empty__content">
          <div className="dashboard-empty__icon">
            <svg
              className="w-20 h-20 text-gray-400"
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
          <h3 className="dashboard-empty__title">
            아직 업로드된 이미지가 없습니다
          </h3>
          <p className="dashboard-empty__description">
            첫 번째 추억을 업로드해서 AI가 분석해드릴게요!
          </p>
          <div className="dashboard-empty__actions">
            {onUploadClick && (
              <button
                onClick={onUploadClick}
                className="dashboard-empty__upload-button"
              >
                <svg
                  className="w-3 h-3 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                이미지 업로드하기
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

DashboardEmpty.displayName = 'DashboardEmpty';

export default DashboardEmpty;
