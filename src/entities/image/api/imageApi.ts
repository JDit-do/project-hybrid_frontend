import { Image, ImageFilters, ImagePagination } from "../model/types";
import { apiGet, apiPatch, apiDelete } from "@/shared/lib/api/apiClient";

export const getAllImage = async (): Promise<any> => {
  try {
    const data = await apiGet<any>(`/api/appsync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `query GetUserImagesContainingAlbumId {
          listMemoryImageMetadata(filter: {
            AlbumID: {
              contains: "d4d8dd2c-f081-7044-370e-4e9caffcc153" 
            }
          }) {
            items {
              AlbumID # 이미지 s3 경로 중 파일명 제외된거 (제거 가능여부 확인중)
              CreatedAt # 업로드된 시간
              ImageSummary # 이미지 요약본
              OriginalKey # 이미지 s3 경로(나중에 이미지 파일명으로 변경 가능)
              Tags #이미지 태그들
              OriginalPresignedUrl  #원본 이미지 링크(avif 파일이 없을때 사용)
              ProcessedPresignedUrl #압축된 이미지 링크 (있으면 사용하기)

            }
            nextToken
          }
        }`,
      }),
    });
    return data;
  } catch (error) {
    console.error("Failed to fetch images:", error);
    throw error;
  }
};

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
    ...(filters.tags && { tags: filters.tags.join(",") }),
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
    console.error("Failed to fetch images:", error);
    throw error;
  }
};

export const getImage = async (imageId: string): Promise<Image> => {
  try {
    const data = await apiGet<Image>(`/api/images/${imageId}`);
    return data;
  } catch (error) {
    console.error("Failed to fetch image:", error);
    throw error;
  }
};

export const updateImage = async (
  imageId: string,
  updates: Partial<Image>
): Promise<Image> => {
  try {
    const data = await apiPatch<Image>(`/api/images/${imageId}`, updates);
    return data;
  } catch (error) {
    console.error("Failed to update image:", error);
    throw error;
  }
};

export const deleteImage = async (imageId: string): Promise<void> => {
  try {
    await apiDelete(`/api/images/${imageId}`);
  } catch (error) {
    console.error("Failed to delete image:", error);
    throw error;
  }
};
