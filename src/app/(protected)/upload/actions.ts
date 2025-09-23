"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

/**
 * 이미지 업로드 Server Action
 */
export async function uploadImage(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session as any).accessToken) {
      throw new Error("Unauthorized - No Access Session");
    }

    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("No file provided");
    }

    // 파일 유효성 검사
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }

    // 파일 크기 제한 (30MB)
    const maxSize = 30 * 1024 * 1024; // 30MB
    if (file.size > maxSize) {
      throw new Error("File size must be less than 30MB");
    }

    // 1단계: Presigned URL 요청
    const API_GATEWAY_PRESIGNED_URL = process.env.API_PRESIGN_API!;
    const presignedResponse = await fetch(API_GATEWAY_PRESIGNED_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${(session as any).accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type || "application/octet-stream",
      }),
    });

    if (!presignedResponse.ok) {
      const errorText = await presignedResponse.text();
      throw new Error(
        `Presigned URL 요청 실패: ${presignedResponse.status} - ${errorText}`
      );
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
      createdAt: new Date().toISOString(),
      size: file.size,
      type: file.type,
    };

    // 갤러리 페이지 캐시 무효화
    revalidatePath("/gallery");

    return {
      success: true,
      image: result,
      message: "이미지가 성공적으로 업로드되었습니다.",
    };
  } catch (error) {
    console.error("Upload error:", error);

    // 에러 시 목업 응답 (개발 환경)
    if (process.env.NODE_ENV === "development") {
      revalidatePath("/gallery");

      return {
        success: true,
        image: {
          id: `image-${Date.now()}`,
          url: `https://picsum.photos/400/400?random=${Date.now()}`,
          title: String(formData.get("title") || "업로드된 이미지"),
          description: String(formData.get("description") || ""),
          createdAt: new Date().toISOString(),
        },
        message: "이미지가 성공적으로 업로드되었습니다. (개발 모드)",
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}
