import { useState, useEffect, useCallback } from "react";
import { ImageService } from "@/shared/lib/api/services/imageService";
import { ImageMetadata } from "@/types/api";

interface UseImageDetailResult {
  image: Image | null;
  loading: boolean;
  error: Error | undefined;
  refetch: () => void;
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

export function useImageDetail(imageId: string): UseImageDetailResult {
  const [image, setImage] = useState<Image | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  const fetchImage = useCallback(async () => {
    if (!imageId) return;

    setLoading(true);
    setError(undefined);

    try {
      const data: ImageMetadata = await ImageService.getImageDetail();

      // ImageMetadata를 Image로 변환
      const imageData: Image = {
        id: data.OriginalKey,
        title: data.ImageSummary,
        description: data.ImageSummary,
        url: data.OriginalPresignedUrl,
        thumbnailUrl: data.ProcessedPresignedUrl || data.OriginalPresignedUrl,
        createdAt: data.CreatedAt,
        tags: data.Tags,
        size: 0, // ImageMetadata에는 size 정보가 없음
      };

      setImage(imageData);
    } catch (err) {
      setError(err as Error);
      console.error("Error fetching image:", err);
    } finally {
      setLoading(false);
    }
  }, [imageId]);

  useEffect(() => {
    fetchImage();
  }, [fetchImage]);

  const refetch = useCallback(() => {
    fetchImage();
  }, [fetchImage]);

  return {
    image,
    loading,
    error,
    refetch,
  };
}
