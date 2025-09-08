'use client';

import { useState } from 'react';
import { Filter, X, Calendar, Tag } from 'lucide-react';
import Button from '@/shared/ui/atoms/Button';
import { SearchFilters as SearchFiltersType } from '../model/useSearch';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  availableTags: string[];
  onFiltersChange: (filters: Partial<SearchFiltersType>) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function SearchFilters({
  filters,
  availableTags,
  onFiltersChange,
  onClearFilters,
  isOpen,
  onToggle,
}: SearchFiltersProps) {
  const [localDateFrom, setLocalDateFrom] = useState(filters.dateFrom || '');
  const [localDateTo, setLocalDateTo] = useState(filters.dateTo || '');

  const handleDateRangeApply = () => {
    onFiltersChange({
      dateFrom: localDateFrom || undefined,
      dateTo: localDateTo || undefined,
    });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    onFiltersChange({ tags: newTags });
  };

  return (
    <div className="relative">
      <Button
        onClick={onToggle}
        variant="outline"
        size="sm"
        className="flex items-center space-x-2"
      >
        <Filter className="h-4 w-4" />
        <span>필터</span>
        {filters.tags.length > 0 && (
          <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
            {filters.tags.length}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 p-4">
          <div className="space-y-4">
            {/* Date Range */}
            <div>
              <h3 className="font-medium mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                날짜 범위
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={localDateFrom}
                  onChange={(e) => setLocalDateFrom(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="시작일"
                />
                <input
                  type="date"
                  value={localDateTo}
                  onChange={(e) => setLocalDateTo(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="종료일"
                />
              </div>
              <Button
                onClick={handleDateRangeApply}
                size="sm"
                className="mt-2"
              >
                적용
              </Button>
            </div>

            {/* Tags */}
            {availableTags.length > 0 && (
              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  태그
                </h3>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`px-2 py-1 text-xs rounded-full transition-colors ${
                        filters.tags.includes(tag)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={onClearFilters}
                variant="outline"
                size="sm"
              >
                <X className="h-4 w-4 mr-1" />
                초기화
              </Button>
              <Button
                onClick={onToggle}
                size="sm"
              >
                닫기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
