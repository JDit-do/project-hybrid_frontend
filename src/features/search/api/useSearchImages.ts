import { useState, useEffect, useCallback } from 'react';
import { ImageService } from '@/shared/lib/api/services/imageService';
import { ImageMetadata } from '@/types/api';

interface UseSearchImagesOptions {
  query: string;
  limit?: number;
  offset?: number;
  enabled?: boolean;
}

interface UseSearchImagesResult {
  images: Image[];
  loading: boolean;
  error: Error | undefined;
  refetch: () => void;
  hasMore: boolean;
}

interface Image {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl: string;
  createdAt: string;
  tags: string[];
  size: number;
}

export function useSearchImages({
  query,
  limit = 20,
  offset = 0,
  enabled = true,
}: UseSearchImagesOptions): UseSearchImagesResult {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  const searchImages = useCallback(async () => {
    if (!enabled || !query.trim()) {
      setImages([]);
      return;
    }

    setLoading(true);
    setError(undefined);

    try {
      const data = await ImageService.searchImages();

      // ImageMetadata를 Image로 변환
      const imageData: Image[] = (data?.items || []).map((item: ImageMetadata) => ({
        id: item.OriginalKey,
        title: item.ImageSummary,
        description: item.ImageSummary,
        url: item.OriginalPresignedUrl,
        thumbnailUrl: item.ProcessedPresignedUrl || item.OriginalPresignedUrl,
        createdAt: item.CreatedAt,
        tags: item.Tags,
        size: 0, // ImageMetadata에는 size 정보가 없음
      }));

      setImages(imageData);
    } catch (err) {
      setError(err as Error);
      console.error('Error searching images:', err);
    } finally {
      setLoading(false);
    }
  }, [query, limit, offset, enabled]);

  useEffect(() => {
    searchImages();
  }, [searchImages]);

  const refetch = useCallback(() => {
    searchImages();
  }, [searchImages]);

  return {
    images,
    loading,
    error,
    refetch,
    hasMore: images.length === limit,
  };
}

