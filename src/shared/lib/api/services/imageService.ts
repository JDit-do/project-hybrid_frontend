// UI 테스트용 Mock 클래스
import { ImageMetadata } from "@/types/api";

export class ImageService {
  static async getImages(): Promise<{
    items: ImageMetadata[];
    nextToken: string | null;
  }> {
    console.log("ImageService.getImages - UI 테스트용 Mock 응답");
    return {
      items: [],
      nextToken: null,
    };
  }

  static async getImageDetail(): Promise<ImageMetadata> {
    console.log("ImageService.getImageDetail - UI 테스트용 Mock 응답");
    throw new Error("ImageService is disabled for UI testing");
  }

  static async searchImages(): Promise<{
    items: ImageMetadata[];
    nextToken: string | null;
  }> {
    console.log("ImageService.searchImages - UI 테스트용 Mock 응답");
    return {
      items: [],
      nextToken: null,
    };
  }

  static async uploadImage() {
    console.log("ImageService.uploadImage - UI 테스트용 Mock 응답");
    throw new Error("ImageService is disabled for UI testing");
  }

  static async deleteImage() {
    console.log("ImageService.deleteImage - UI 테스트용 Mock 응답");
    throw new Error("ImageService is disabled for UI testing");
  }
}

// ImageService 인스턴스 export
export const imageService = new ImageService();
