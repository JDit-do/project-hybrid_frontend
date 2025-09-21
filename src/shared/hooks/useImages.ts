// useImages Hook - UI 테스트를 위해 주석 처리
/*
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { ImageService } from '@/shared/lib/api/services/imageService';
import { ImageMetadata } from '@/types/api';

export function useImages(limit: number = 20) {
  const [images, setImages] = useState<ImageMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextToken, setNextToken] = useState<string | null>(null);

  const { data, loading: queryLoading, error: queryError } = useQuery(GET_IMAGES, {
    variables: { limit },
    fetchPolicy: 'cache-first',
  });

  useEffect(() => {
    if (data?.listMemoryImageMetadata) {
      setImages(data.listMemoryImageMetadata.items);
      setNextToken(data.listMemoryImageMetadata.nextToken);
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    if (queryError) {
      setError(queryError.message);
      setLoading(false);
    }
  }, [queryError]);

  const loadMore = async () => {
    if (!nextToken || loading) return;

    try {
      setLoading(true);
      const result = await ImageService.getImages(limit, nextToken);
      setImages(prev => [...prev, ...result.items]);
      setNextToken(result.nextToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more images');
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await ImageService.getImages(limit);
      setImages(result.items);
      setNextToken(result.nextToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh images');
    } finally {
      setLoading(false);
    }
  };

  return {
    images,
    loading: loading || queryLoading,
    error,
    hasMore: !!nextToken,
    loadMore,
    refresh,
  };
}

export function useImageDetail(imageId: string) {
  const [image, setImage] = useState<ImageMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data, loading: queryLoading, error: queryError } = useQuery(GET_IMAGE_DETAIL, {
    variables: { imageId },
    skip: !imageId,
    fetchPolicy: 'cache-first',
  });

  useEffect(() => {
    if (data?.getMemoryImageMetadata) {
      setImage(data.getMemoryImageMetadata);
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    if (queryError) {
      setError(queryError.message);
      setLoading(false);
    }
  }, [queryError]);

  return {
    image,
    loading: loading || queryLoading,
    error,
  };
}

export function useImageSearch() {
  const [searchResults, setSearchResults] = useState<ImageMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchImages = async (query: string, limit: number = 20) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await ImageService.searchImages(query, limit);
      setSearchResults(result.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search images');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
    setError(null);
  };

  return {
    searchResults,
    loading,
    error,
    searchImages,
    clearSearch,
  };
}
*/

// UI 테스트용 Mock Hook
import { useState } from 'react';

export function useImages(limit: number = 20) {
  console.log('useImages - UI 테스트용 Mock Hook');
  
  return {
    images: [],
    loading: false,
    error: null,
    hasMore: false,
    loadMore: () => console.log('loadMore - UI 테스트용 Mock'),
    refresh: () => console.log('refresh - UI 테스트용 Mock'),
  };
}

export function useImageDetail(imageId: string) {
  console.log('useImageDetail - UI 테스트용 Mock Hook');
  
  return {
    image: null,
    loading: false,
    error: null,
  };
}

export function useImageSearch() {
  console.log('useImageSearch - UI 테스트용 Mock Hook');
  
  return {
    searchResults: [],
    loading: false,
    error: null,
    searchImages: () => console.log('searchImages - UI 테스트용 Mock'),
    clearSearch: () => console.log('clearSearch - UI 테스트용 Mock'),
  };
}