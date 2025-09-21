import { gql } from '@apollo/client';

// 이미지 타입 정의
export interface Image {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  fullImage: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  fileSize: number;
  width: number;
  height: number;
}

// 이미지 목록 조회 쿼리
export const GET_IMAGES = gql`
  query GetImages($limit: Int, $offset: Int, $sortBy: String) {
    images(limit: $limit, offset: $offset, sortBy: $sortBy) {
      id
      title
      description
      thumbnail
      tags
      createdAt
      fileSize
      width
      height
    }
  }
`;

// 이미지 상세 조회 쿼리
export const GET_IMAGE_DETAIL = gql`
  query GetImageDetail($id: ID!) {
    image(id: $id) {
      id
      title
      description
      thumbnail
      fullImage
      tags
      createdAt
      updatedAt
      fileSize
      width
      height
    }
  }
`;

// 이미지 검색 쿼리
export const SEARCH_IMAGES = gql`
  query SearchImages($query: String!, $limit: Int, $offset: Int) {
    searchImages(query: $query, limit: $limit, offset: $offset) {
      id
      title
      description
      thumbnail
      tags
      createdAt
      fileSize
      width
      height
    }
  }
`;

// 태그 목록 조회 쿼리
export const GET_TAGS = gql`
  query GetTags {
    tags {
      id
      name
      count
    }
  }
`;

// 이미지 업로드 뮤테이션 (REST API 사용하므로 실제로는 사용하지 않음)
export const UPLOAD_IMAGE = gql`
  mutation UploadImage($input: ImageUploadInput!) {
    uploadImage(input: $input) {
      id
      title
      thumbnail
      createdAt
    }
  }
`;

