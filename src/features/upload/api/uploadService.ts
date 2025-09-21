// 업로드 관련 API 서비스 (REST API 사용)

import { apiConfig } from "@/shared/lib/config/api";

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResponse {
  success: boolean;
  imageId?: string;
  error?: string;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  imageId: string;
  fields: Record<string, string>;
}

class UploadService {
  private baseUrl = apiConfig.baseUrl;

  // Presigned URL 요청
  async getPresignedUrl(file: File): Promise<PresignedUrlResponse> {
    const response = await fetch(`${this.baseUrl}/upload/presigned-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      }),
    });

    if (!response.ok) {
      throw new Error('Presigned URL 요청 실패');
    }

    return response.json();
  }

  // 파일 업로드
  async uploadFile(
    file: File,
    presignedData: PresignedUrlResponse,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResponse> {
    const formData = new FormData();
    
    // Presigned URL에서 받은 필드들 추가
    Object.entries(presignedData.fields).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    // 파일 추가
    formData.append('file', file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // 진행률 추적
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100),
          };
          onProgress(progress);
        }
      });

      // 완료 처리
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({
            success: true,
            imageId: presignedData.imageId,
          });
        } else {
          resolve({
            success: false,
            error: '업로드 실패',
          });
        }
      });

      // 에러 처리
      xhr.addEventListener('error', () => {
        resolve({
          success: false,
          error: '네트워크 오류',
        });
      });

      // 요청 전송
      xhr.open('POST', presignedData.uploadUrl);
      xhr.send(formData);
    });
  }

  // 전체 업로드 프로세스
  async uploadImage(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResponse> {
    try {
      // 1. Presigned URL 요청
      const presignedData = await this.getPresignedUrl(file);
      
      // 2. 파일 업로드
      const result = await this.uploadFile(file, presignedData, onProgress);
      
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      };
    }
  }

  // 인증 토큰 가져오기
  private getAuthToken(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth-token') || '';
    }
    return '';
  }
}

export const uploadService = new UploadService();

