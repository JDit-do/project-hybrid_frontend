'use server';

import { revalidatePath } from "next/cache";

/**
 * 이미지 업로드 Server Action (토큰을 매개변수로 받는 방식)
 * 클라이언트에서 토큰을 전달받아 사용
 */
export async function uploadImageWithToken(formData: FormData, accessToken: string) {
  try {
    if (!accessToken) {
      throw new Error("No access token provided");
    }

    // FormData에서 데이터 추출
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const tags = formData.get("tags") as string;

    if (!file) {
      throw new Error("No file provided");
    }

    // 파일 유효성 검사
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }

    // 파일 크기 제한 (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error("File size must be less than 10MB");
    }

    // 1단계: Presigned URL 요청
    const API_GATEWAY_PRESIGNED_URL = process.env.API_PRESIGN_API!;
    
    const presignedResponse = await fetch(API_GATEWAY_PRESIGNED_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type || "application/octet-stream",
      }),
    });

    if (!presignedResponse.ok) {
      const errorText = await presignedResponse.text();
      throw new Error(`Presigned URL 요청 실패: ${presignedResponse.status} - ${errorText}`);
    }

    const presignedData = await presignedResponse.json();
    const uploadUrl = presignedData.uploadUrl;

    // 2단계: S3에 파일 업로드
    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type || "application/octet-stream",
      },
    });

    if (!uploadResponse.ok) {
      throw new Error(`S3 업로드 실패: ${uploadResponse.statusText}`);
    }

    // 3단계: 업로드 완료 후 메타데이터 반환
    const result = {
      id: presignedData.id || `image-${Date.now()}`,
      url: presignedData.imageUrl || uploadUrl.split("?")[0],
      title: title || file.name,
      description: description || "",
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      createdAt: new Date().toISOString(),
      size: file.size,
      type: file.type,
    };

    // 갤러리 페이지 캐시 무효화
    revalidatePath('/gallery');

    return {
      success: true,
      image: result,
      message: "이미지가 성공적으로 업로드되었습니다."
    };

  } catch (error) {
    console.error('Upload error:', error);
    
    // 에러 시 목업 응답 (개발 환경)
    if (process.env.NODE_ENV === "development") {
      revalidatePath('/gallery');
      return {
        success: true,
        image: {
          id: `image-${Date.now()}`,
          url: `https://picsum.photos/400/400?random=${Date.now()}`,
          title: formData.get("title") || "업로드된 이미지",
          description: formData.get("description") || "",
          createdAt: new Date().toISOString(),
        },
        message: "이미지가 성공적으로 업로드되었습니다. (개발 모드)"
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed"
    };
  }
}










