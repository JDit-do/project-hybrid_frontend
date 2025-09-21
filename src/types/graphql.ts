// GraphQL 쿼리 타입 정의
export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  size: number;
  type: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GalleryImagesResponse {
  images: GalleryImage[];
  pagination: Pagination;
}

// GraphQL 쿼리 변수 타입
export interface GalleryImagesVariables {
  page: number;
  limit: number;
  sortBy: string;
  order: string;
}

// GraphQL 에러 타입
export interface GraphQLError {
  message: string;
  locations?: Array<{
    line: number;
    column: number;
  }>;
  path?: string[];
  extensions?: Record<string, any>;
}









