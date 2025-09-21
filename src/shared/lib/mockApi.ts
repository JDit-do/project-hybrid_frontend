/**
 * 개발 환경용 Mock API 서비스
 */

/**
 * Mock GraphQL 응답
 */
export function createMockGraphQLResponse(query: string) {
  // 쿼리 타입에 따라 다른 Mock 응답 반환
  if (query.includes('listMemoryImageMetadata')) {
    return {
      data: {
        listMemoryImageMetadata: {
          items: [
            {
              AlbumID: "mock-album-1",
              CreatedAt: new Date().toISOString(),
              ImageSummary: "Mock image summary",
              OriginalKey: "mock-images/sample1.jpg",
              Tags: ["mock", "sample", "test"],
              OriginalPresignedUrl: "https://via.placeholder.com/800x600/6366f1/ffffff?text=Mock+Image+1",
              ProcessedPresignedUrl: "https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Processed+1"
            },
            {
              AlbumID: "mock-album-2", 
              CreatedAt: new Date(Date.now() - 86400000).toISOString(),
              ImageSummary: "Another mock image",
              OriginalKey: "mock-images/sample2.jpg",
              Tags: ["mock", "demo"],
              OriginalPresignedUrl: "https://via.placeholder.com/800x600/10b981/ffffff?text=Mock+Image+2",
              ProcessedPresignedUrl: "https://via.placeholder.com/400x300/059669/ffffff?text=Processed+2"
            }
          ],
          nextToken: null
        }
      }
    };
  }

  if (query.includes('getSortedImagesForUser')) {
    return {
      data: {
        getSortedImagesForUser: {
          UserID: "mock-user-id",
          SortedData: {
            categories: [
              {
                categoryName: "Recent Photos",
                description: "Recently uploaded photos",
                images: [
                  {
                    imageKey: "mock-images/recent1.jpg",
                    presignedUrl: "https://via.placeholder.com/400x300/ef4444/ffffff?text=Recent+1"
                  },
                  {
                    imageKey: "mock-images/recent2.jpg", 
                    presignedUrl: "https://via.placeholder.com/400x300/f59e0b/ffffff?text=Recent+2"
                  }
                ]
              },
              {
                categoryName: "Nature",
                description: "Nature and landscape photos",
                images: [
                  {
                    imageKey: "mock-images/nature1.jpg",
                    presignedUrl: "https://via.placeholder.com/400x300/10b981/ffffff?text=Nature+1"
                  }
                ]
              }
            ]
          }
        }
      }
    };
  }

  // 기본 응답
  return {
    data: {
      message: "Mock GraphQL response",
      query: query.substring(0, 100) + "..."
    }
  };
}

/**
 * Mock Presign API 응답
 */
export function createMockPresignResponse(fileName: string, contentType: string) {
  return {
    uploadUrl: `https://mock-s3-bucket.s3.amazonaws.com/mock-uploads/${Date.now()}-${fileName}`,
    key: `mock-uploads/${Date.now()}-${fileName}`,
    expiresIn: 3600
  };
}

/**
 * Mock API 지연 시뮬레이션
 */
export function delay(ms: number = 1000): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}











