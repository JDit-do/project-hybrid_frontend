import { useState, useEffect, useCallback } from 'react';
import { useImages } from '../api/useImages';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';

interface Image {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  fullImage: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  fileSize: number;
  width: number;
  height: number;
}

interface GalleryOptions {
  pageSize?: number;
  maxRetries?: number;
}

interface ErrorState {
  hasError: boolean;
  message: string;
  code?: string;
}

export function useGalleryGraphQL(options: GalleryOptions = {}) {
  const [images, setImages] = useState<Image[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    message: '',
  });
  const [canRetry, setCanRetry] = useState(false);
  const [offset, setOffset] = useState(0);

  const { handleError } = useErrorHandler();

  // GraphQL을 사용한 이미지 조회
  const { 
    images: fetchedImages, 
    loading, 
    error, 
    refetch,
    hasMore: graphqlHasMore 
  } = useImages({
    limit: options?.pageSize || 20,
    offset,
    sortBy: 'newest',
    enabled: true,
  });

  // 에러 처리
  useEffect(() => {
    if (error) {
      const errorMessage = error.message || '이미지를 불러오는데 실패했습니다.';
      setErrorState({
        hasError: true,
        message: errorMessage,
        code: 'LOAD_IMAGES_FAILED',
      });
      setCanRetry(true);
      handleError(error);
    } else {
      setErrorState({ hasError: false, message: '' });
      setCanRetry(false);
    }
  }, [error, handleError]);

  // 이미지 데이터 업데이트
  useEffect(() => {
    if (fetchedImages.length > 0) {
      if (offset === 0) {
        // 초기 로드 또는 리셋
        setImages(fetchedImages);
        setIsInitialLoad(false);
      } else {
        // 추가 로드
        setImages(prev => [...prev, ...fetchedImages]);
      }
      setHasMore(graphqlHasMore);
    }
  }, [fetchedImages, offset, graphqlHasMore]);

  const loadImages = useCallback(async (reset = false) => {
    if (loading) return;

    if (reset) {
      setOffset(0);
      setImages([]);
      setIsInitialLoad(true);
    } else {
      setOffset(prev => prev + (options?.pageSize || 20));
    }
  }, [loading, options?.pageSize]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setOffset(prev => prev + (options?.pageSize || 20));
    }
  }, [loading, hasMore, options?.pageSize]);

  const setFilteredImages = useCallback((filteredImages: Image[]) => {
    setImages(filteredImages);
  }, []);

  const changeViewMode = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode);
  }, []);

  const selectImage = useCallback((image: Image) => {
    setSelectedImage(image);
  }, []);

  const retry = useCallback(() => {
    if (canRetry) {
      refetch();
    }
  }, [canRetry, refetch]);

  const clearError = useCallback(() => {
    setErrorState({ hasError: false, message: '' });
    setCanRetry(false);
  }, []);

  // 초기 로드
  useEffect(() => {
    if (isInitialLoad) {
      loadImages(true);
    }
  }, [isInitialLoad, loadImages]);

  return {
    images,
    loading,
    hasMore,
    viewMode,
    selectedImage,
    isInitialLoad,
    errorState,
    canRetry,
    loadImages,
    loadMore,
    setFilteredImages,
    changeViewMode,
    selectImage,
    retry,
    clearError,
  };
}

