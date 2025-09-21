// Image Service - UI 테스트를 위해 주석 처리
/*
import { apolloClient } from '../client';
import { gql } from '@apollo/client';
import { ImageMetadata, UploadResponse } from '@/types/api';

// GraphQL 쿼리 정의
const GET_IMAGES = gql`
  query GetUserImages($limit: Int, $nextToken: String) {
    listMemoryImageMetadata(limit: $limit, nextToken: $nextToken) {
      items {
        AlbumID
        CreatedAt
        ImageSummary
        OriginalKey
        Tags
        OriginalPresignedUrl
        ProcessedPresignedUrl
      }
      nextToken
    }
  }
`;

const GET_IMAGE_DETAIL = gql`
  query GetImageDetail($imageId: ID!) {
    getMemoryImageMetadata(id: $imageId) {
      AlbumID
      CreatedAt
      ImageSummary
      OriginalKey
      Tags
      OriginalPresignedUrl
      ProcessedPresignedUrl
    }
  }
`;

const SEARCH_IMAGES = gql`
  query SearchImages($query: String!, $limit: Int) {
    searchMemoryImageMetadata(query: $query, limit: $limit) {
      items {
        AlbumID
        CreatedAt
        ImageSummary
        OriginalKey
        Tags
        OriginalPresignedUrl
        ProcessedPresignedUrl
      }
      nextToken
    }
  }
`;

export class ImageService {
  // 이미지 목록 조회
  static async getImages(limit: number = 20, nextToken?: string): Promise<{
    items: ImageMetadata[];
    nextToken?: string;
  }> {
    try {
      const { data } = await apolloClient.query({
        query: GET_IMAGES,
        variables: { limit, nextToken },
        fetchPolicy: 'cache-first',
      });

      return data.listMemoryImageMetadata;
    } catch (error) {
      console.error('Error fetching images:', error);
      throw new Error('Failed to fetch images');
    }
  }

  // 이미지 상세 조회
  static async getImageDetail(imageId: string): Promise<ImageMetadata> {
    try {
      const { data } = await apolloClient.query({
        query: GET_IMAGE_DETAIL,
        variables: { imageId },
        fetchPolicy: 'cache-first',
      });

      return data.getMemoryImageMetadata;
    } catch (error) {
      console.error('Error fetching image detail:', error);
      throw new Error('Failed to fetch image detail');
    }
  }

  // 이미지 검색
  static async searchImages(query: string, limit: number = 20): Promise<{
    items: ImageMetadata[];
    nextToken?: string;
  }> {
    try {
      const { data } = await apolloClient.query({
        query: SEARCH_IMAGES,
        variables: { query, limit },
        fetchPolicy: 'cache-first',
      });

      return data.searchMemoryImageMetadata;
    } catch (error) {
      console.error('Error searching images:', error);
      throw new Error('Failed to search images');
    }
  }

  // 이미지 업로드 (REST API 사용)
  static async uploadImage(file: File): Promise<UploadResponse> {
    try {
      // 1. Presigned URL 요청
      const presignResponse = await fetch('/api/presign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
        }),
      });

      if (!presignResponse.ok) {
        throw new Error('Failed to get presigned URL');
      }

      const { uploadUrl, key } = await presignResponse.json();

      // 2. S3에 파일 업로드
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to S3');
      }

      // 3. 업로드 성공 응답
      return {
        success: true,
        key,
        url: uploadUrl,
        message: 'Image uploaded successfully',
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  }

  // 이미지 삭제
  static async deleteImage(imageId: string): Promise<void> {
    try {
      // TODO: 이미지 삭제 로직 구현
      console.log('Delete image:', imageId);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error('Failed to delete image');
    }
  }
}
*/

// UI 테스트용 Mock 클래스
export class ImageService {
  static async getImages(limit: number = 20, nextToken?: string) {
    console.log('ImageService.getImages - UI 테스트용 Mock 응답');
    return {
      items: [],
      nextToken: null,
    };
  }

  static async getImageDetail(imageId: string) {
    console.log('ImageService.getImageDetail - UI 테스트용 Mock 응답');
    throw new Error('ImageService is disabled for UI testing');
  }

  static async searchImages(query: string, limit: number = 20) {
    console.log('ImageService.searchImages - UI 테스트용 Mock 응답');
    return {
      items: [],
      nextToken: null,
    };
  }

  static async uploadImage(file: File) {
    console.log('ImageService.uploadImage - UI 테스트용 Mock 응답');
    throw new Error('ImageService is disabled for UI testing');
  }

  static async deleteImage(imageId: string) {
    console.log('ImageService.deleteImage - UI 테스트용 Mock 응답');
    throw new Error('ImageService is disabled for UI testing');
  }
}