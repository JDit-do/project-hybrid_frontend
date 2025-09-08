'use client';

import { useState, useCallback, useMemo } from 'react';
import { Image } from '@/entities/image/model/types';

export interface SearchFilters {
  query: string;
  tags: string[];
  dateFrom?: string;
  dateTo?: string;
  sortBy: 'newest' | 'oldest' | 'title' | 'size';
}

export interface UseSearchOptions {
  initialFilters?: Partial<SearchFilters>;
}

export function useSearch(options: UseSearchOptions = {}) {
  const { initialFilters = {} } = options;
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    tags: [],
    sortBy: 'newest',
    ...initialFilters,
  });

  // Search images based on filters
  const searchImages = useCallback((images: Image[]): Image[] => {
    let filteredImages = [...images];

    // Text search
    if (filters.query.trim()) {
      const query = filters.query.toLowerCase();
      filteredImages = filteredImages.filter(image =>
        image.title.toLowerCase().includes(query) ||
        image.description?.toLowerCase().includes(query) ||
        image.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Tag filter
    if (filters.tags.length > 0) {
      filteredImages = filteredImages.filter(image =>
        image.tags?.some(tag => filters.tags.includes(tag))
      );
    }

    // Date range filter
    if (filters.dateFrom) {
      filteredImages = filteredImages.filter(image =>
        new Date(image.createdAt) >= new Date(filters.dateFrom!)
      );
    }

    if (filters.dateTo) {
      filteredImages = filteredImages.filter(image =>
        new Date(image.createdAt) <= new Date(filters.dateTo!)
      );
    }

    // Sort
    filteredImages.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'size':
          return b.fileSize - a.fileSize;
        default:
          return 0;
      }
    });

    return filteredImages;
  }, [filters]);

  // Update search query
  const setQuery = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, query }));
  }, []);

  // Update tags filter
  const setTags = useCallback((tags: string[]) => {
    setFilters(prev => ({ ...prev, tags }));
  }, []);

  // Add tag to filter
  const addTag = useCallback((tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags : [...prev.tags, tag]
    }));
  }, []);

  // Remove tag from filter
  const removeTag = useCallback((tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  }, []);

  // Update date range
  const setDateRange = useCallback((dateFrom?: string, dateTo?: string) => {
    setFilters(prev => ({ ...prev, dateFrom, dateTo }));
  }, []);

  // Update sort
  const setSortBy = useCallback((sortBy: SearchFilters['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      query: '',
      tags: [],
      sortBy: 'newest',
    });
  }, []);

  // Get available tags from images
  const getAvailableTags = useCallback((images: Image[]): string[] => {
    const tagSet = new Set<string>();
    images.forEach(image => {
      image.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.query.trim() !== '' ||
      filters.tags.length > 0 ||
      filters.dateFrom ||
      filters.dateTo ||
      filters.sortBy !== 'newest'
    );
  }, [filters]);

  return {
    // State
    filters,
    hasActiveFilters,
    
    // Actions
    searchImages,
    setQuery,
    setTags,
    addTag,
    removeTag,
    setDateRange,
    setSortBy,
    clearFilters,
    getAvailableTags,
  };
}
