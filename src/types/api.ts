/**
 * API 관련 타입 정의
 */

// 공통 타입
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 이미지 관련 타입
export interface Image {
  id: string;
  url: string;
  metadata: {
    tags: string[];
    createdAt: string;
    description?: string;
    user?: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export interface ImageFilter {
  tags?: string[];
  userId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  limit?: number;
  offset?: number;
}

export interface UploadResult {
  key: string;
  url: string;
}

// 사용자 관련 타입
export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
}

// GraphQL 응답 타입
export interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
  }>;
}

// REST API 응답 타입
export interface RestResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}











