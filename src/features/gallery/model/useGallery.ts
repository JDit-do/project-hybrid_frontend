'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Image } from '@/entities/image/model/types';
import { GalleryService, GalleryState, GalleryOptions } from './GalleryService';

export function useGallery(options: GalleryOptions = {}) {
  const [state, setState] = useState<GalleryState>(() => {
    const service = new GalleryService(options);
    return service.getState();
  });
  
  const serviceRef = useRef<GalleryService | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Initialize service
  useEffect(() => {
    serviceRef.current = new GalleryService(options);
    
    // Subscribe to state changes
    const unsubscribe = serviceRef.current.subscribe((newState) => {
      setState(newState);
    });

    return () => {
      unsubscribe();
      serviceRef.current?.destroy();
    };
  }, [options?.pageSize, options?.maxRetries]); // 옵셔널 체이닝 추가
  // eslint-disable-next-line react-hooks/exhaustive-deps

  // Load images
  const loadImages = useCallback(async (reset = false) => {
    await serviceRef.current?.loadImages(reset);
  }, []);

  // Load more images (for infinite scroll)
  const loadMore = useCallback(async () => {
    await serviceRef.current?.loadMore();
  }, []);

  // Set filtered images (from search feature)
  const setFilteredImages = useCallback((filteredImages: Image[]) => {
    serviceRef.current?.setFilteredImages(filteredImages);
  }, []);

  // View mode
  const changeViewMode = useCallback((mode: 'grid' | 'list') => {
    serviceRef.current?.changeViewMode(mode);
  }, []);

  // Image selection
  const selectImage = useCallback((image: Image | null) => {
    serviceRef.current?.selectImage(image);
  }, []);

  // Delete image
  const handleDeleteImage = useCallback(async (imageId: string) => {
    await serviceRef.current?.deleteImage(imageId);
  }, []);

  // Update image
  const handleUpdateImage = useCallback(async (imageId: string, updates: Partial<Image>) => {
    await serviceRef.current?.updateImage(imageId, updates);
  }, []);

  // Error handling
  const clearError = useCallback(() => {
    serviceRef.current?.clearError();
  }, []);

  const retry = useCallback(async () => {
    await serviceRef.current?.retry();
  }, []);

  const canRetry = useCallback(() => {
    return serviceRef.current?.canRetry() || false;
  }, []);

  return {
    // State
    images: state.images,
    loading: state.loading,
    hasMore: state.hasMore,
    viewMode: state.viewMode,
    selectedImage: state.selectedImage,
    isInitialLoad: state.isInitialLoad,
    
    // Error state
    errorState: {
      hasError: !!state.error,
      message: state.error?.message || '',
      code: state.error?.name,
      retryCount: state.retryCount,
    },
    canRetry: canRetry(),
    
    // Actions
    loadImages,
    loadMore,
    setFilteredImages,
    changeViewMode,
    selectImage,
    deleteImage: handleDeleteImage,
    updateImage: handleUpdateImage,
    retry,
    clearError,
    
    // Refs for intersection observer
    observerRef,
  };
}
