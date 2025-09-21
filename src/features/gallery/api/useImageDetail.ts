import { useQuery } from '@apollo/client';
import { GET_IMAGE_DETAIL, Image } from '@/lib/graphql/queries';

interface UseImageDetailResult {
  image: Image | null;
  loading: boolean;
  error: any;
  refetch: () => void;
}

export function useImageDetail(imageId: string): UseImageDetailResult {
  const { data, loading, error, refetch } = useQuery(GET_IMAGE_DETAIL, {
    variables: {
      id: imageId,
    },
    skip: !imageId,
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  const image = data?.image || null;

  return {
    image,
    loading,
    error,
    refetch,
  };
}

