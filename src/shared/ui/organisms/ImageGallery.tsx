'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid3X3, List, Search, Filter } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/molecules/Card';
import Button from '@/shared/ui/atoms/Button';
import { Image } from '@/entities/image/model/types';

interface ImageGalleryProps {
  images: Image[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onImageClick: (image: Image) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export default function ImageGallery({
  images,
  loading,
  hasMore,
  onLoadMore,
  onImageClick,
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}: ImageGalleryProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastImageRef = useRef<HTMLDivElement | null>(null);

  const lastImageElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore, onLoadMore]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="이미지 검색..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="newest">최신순</option>
            <option value="oldest">오래된순</option>
            <option value="title">제목순</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Image Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'
          : 'space-y-4'
      }>
        <AnimatePresence>
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              ref={index === images.length - 1 ? lastImageElementRef : null}
              onClick={() => onImageClick(image)}
              className="cursor-pointer group"
            >
              {viewMode === 'grid' ? (
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={image.thumbnail}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-sm truncate">{image.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(image.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="flex items-center space-x-4 p-4 hover:shadow-lg transition-shadow duration-300">
                  <div className="w-20 h-20 relative overflow-hidden rounded-lg flex-shrink-0">
                    <img
                      src={image.thumbnail}
                      alt={image.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{image.title}</h3>
                    <p className="text-sm text-gray-500 truncate mt-1">
                      {image.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(image.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* End of data indicator */}
      {!hasMore && images.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          모든 이미지를 불러왔습니다.
        </div>
      )}
    </div>
  );
}
