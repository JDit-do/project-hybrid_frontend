import { useState, useEffect, useCallback } from "react";
import { ImageService } from "@/shared/lib/api/services/imageService";
import { ImageMetadata } from "@/types/api";

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
  sortBy?: "newest" | "oldest" | "title" | "size";
  enabled?: boolean;
}

interface UseImagesResult {
  images: Image[];
  loading: boolean;
  error: Error | undefined;
  refetch: () => void;
  hasMore: boolean;
}

export function useImages({
  limit = 20,
  offset = 0,
  sortBy = "newest",
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
      const data = await ImageService.getImages();

      // ImageMetadata를 Image로 변환
      const imageData: Image[] = (data?.items || []).map((item: ImageMetadata) => ({
        id: item.OriginalKey,
        title: item.ImageSummary,
        url: item.OriginalPresignedUrl,
        thumbnailUrl: item.ProcessedPresignedUrl || item.OriginalPresignedUrl,
        createdAt: item.CreatedAt,
        tags: item.Tags,
        size: 0, // ImageMetadata에는 size 정보가 없음
      }));

      setImages(imageData);
    } catch (err) {
      setError(err);
      console.error("Error fetching images:", err);
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
