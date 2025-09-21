import { useQuery } from '@apollo/client';
import { SEARCH_IMAGES, Image } from '@/lib/graphql/queries';

interface UseSearchImagesOptions {
  query: string;
  limit?: number;
  offset?: number;
  enabled?: boolean;
}

interface UseSearchImagesResult {
  images: Image[];
  loading: boolean;
  error: any;
  refetch: () => void;
  hasMore: boolean;
}

export function useSearchImages({
  query,
  limit = 20,
  offset = 0,
  enabled = true,
}: UseSearchImagesOptions): UseSearchImagesResult {
  const { data, loading, error, refetch } = useQuery(SEARCH_IMAGES, {
    variables: {
      query,
      limit,
      offset,
    },
    skip: !enabled || !query.trim(),
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  const images = data?.searchImages || [];
  const hasMore = images.length === limit;

  return {
    images,
    loading,
    error,
    refetch,
    hasMore,
  };
}

