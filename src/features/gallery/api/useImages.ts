import { useState, useEffect, useCallback } from 'react';
import { graphqlService } from '@/shared/api/graphqlService';
import { GET_IMAGES } from '@/lib/graphql/queries';

interface Image {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  createdAt: string;
  tags: string[];
  size: number;
}

interface UseImagesOptions {
  limit?: number;
  offset?: number;
  sortBy?: 'newest' | 'oldest' | 'title' | 'size';
  enabled?: boolean;
}

interface UseImagesResult {
  images: Image[];
  loading: boolean;
  error: any;
  refetch: () => void;
  hasMore: boolean;
}

export function useImages({
  limit = 20,
  offset = 0,
  sortBy = 'newest',
  enabled = true,
}: UseImagesOptions = {}): UseImagesResult {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchImages = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const data = await graphqlService.query(GET_IMAGES, {
        limit,
        offset,
        sortBy,
      });

      setImages(data?.images || []);
    } catch (err) {
      setError(err);
      console.error('Error fetching images:', err);
    } finally {
      setLoading(false);
    }
  }, [limit, offset, sortBy, enabled]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const refetch = useCallback(() => {
    fetchImages();
  }, [fetchImages]);

  const hasMore = images.length === limit;

  return {
    images,
    loading,
    error,
    refetch,
    hasMore,
  };
}
