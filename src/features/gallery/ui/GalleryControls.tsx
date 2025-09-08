'use client';

import { Grid3X3, List, Search, X } from 'lucide-react';
import Button from '@/shared/ui/atoms/Button';
import SearchInput from '@/features/search/ui/SearchInput';
import SearchFilters from '@/features/search/ui/SearchFilters';
import { useSearch } from '@/features/search/model/useSearch';
import { Image } from '@/entities/image/model/types';
import { useState, useEffect } from 'react';

interface GalleryControlsProps {
  images: Image[];
  onFilteredImagesChange: (images: Image[]) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export default function GalleryControls({
  images,
  onFilteredImagesChange,
  viewMode,
  onViewModeChange,
}: GalleryControlsProps) {
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    filters,
    searchImages,
    setQuery,
    setSortBy,
    clearFilters,
    getAvailableTags,
  } = useSearch();

  // Update filtered images when filters change
  useEffect(() => {
    const filteredImages = searchImages(images);
    onFilteredImagesChange(filteredImages);
  }, [images, filters, searchImages, onFilteredImagesChange]);

  const availableTags = getAvailableTags(images);

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div className="flex items-center space-x-4 flex-wrap">
        <div className="search-input-prism">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="이미지 검색..."
            value={filters.query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-field"
          />
          {filters.query && (
            <button
              onClick={() => setQuery('')}
              className="search-clear"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <select
          value={filters.sortBy}
          onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'title' | 'size')}
          className="input-prism min-w-[120px]"
        >
          <option value="newest">최신순</option>
          <option value="oldest">오래된순</option>
          <option value="title">제목순</option>
          <option value="size">크기순</option>
        </select>

        <SearchFilters
          filters={filters}
          availableTags={availableTags}
          onFiltersChange={(newFilters) => {
            // Update individual filter properties
            if (newFilters.query !== undefined) setQuery(newFilters.query);
            if (newFilters.sortBy !== undefined) setSortBy(newFilters.sortBy);
            // Add other filter updates as needed
          }}
          onClearFilters={clearFilters}
          isOpen={showFilters}
          onToggle={() => setShowFilters(!showFilters)}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onViewModeChange('grid')}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
            viewMode === 'grid' 
              ? 'bg-primary-500 text-white shadow-lg' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <Grid3X3 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
            viewMode === 'list' 
              ? 'bg-primary-500 text-white shadow-lg' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <List className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
