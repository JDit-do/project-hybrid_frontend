import { Image, ImageFilters, ImagePagination } from '../model/types';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/shared/lib/api/apiClient';

export const getImages = async (
  filters: ImageFilters, 
  pagination: { page: number; limit: number }
): Promise<{
  images: Image[];
  pagination: ImagePagination;
}> => {
  const params = new URLSearchParams({
    page: pagination.page.toString(),
    limit: pagination.limit.toString(),
    sortBy: filters.sortBy,
    ...(filters.search && { search: filters.search }),
    ...(filters.tags && { tags: filters.tags.join(',') }),
    ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
    ...(filters.dateTo && { dateTo: filters.dateTo }),
  });

  try {
    const data = await apiGet<{
      images: Image[];
      pagination: ImagePagination;
    }>(`/api/images?${params}`);
    return data;
  } catch (error) {
    console.error('Failed to fetch images:', error);
    throw error;
  }
};

export const getImage = async (imageId: string): Promise<Image> => {
  try {
    const data = await apiGet<Image>(`/api/images/${imageId}`);
    return data;
  } catch (error) {
    console.error('Failed to fetch image:', error);
    throw error;
  }
};

export const updateImage = async (imageId: string, updates: Partial<Image>): Promise<Image> => {
  try {
    const data = await apiPatch<Image>(`/api/images/${imageId}`, updates);
    return data;
  } catch (error) {
    console.error('Failed to update image:', error);
    throw error;
  }
};

export const deleteImage = async (imageId: string): Promise<void> => {
  try {
    await apiDelete(`/api/images/${imageId}`);
  } catch (error) {
    console.error('Failed to delete image:', error);
    throw error;
  }
};
