import { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/shared/lib/api/auth";
import { withApiHandler } from "@/shared/lib/api/response";
import { SUCCESS_MESSAGES } from "@/shared/lib/api/constants";
import { apiConfig } from "@/shared/lib/config/api";

const PRESIGN_API_ENDPOINT = apiConfig.presignApi;

if (!PRESIGN_API_ENDPOINT) {
  throw new Error("Presign API endpoint is not configured");
}

export async function POST(request: NextRequest) {
  return withApiHandler(async () => {
    const { user, error } = await getAuthenticatedUser();
    if (error) {
      throw new Error("Unauthorized");
    }

    const { fileName, contentType } = await request.json();

    if (!fileName || !contentType) {
      throw new Error("Bad Request: fileName and contentType are required");
    }

    // 개발 환경에서는 로컬에서 프리사인 URL 생성 (주석처리)
    // if (process.env.NODE_ENV === 'development') {
    //   const mockUploadUrl = `https://memory-images-originals-dev.s3.amazonaws.com/album/${user.id}/${Date.now()}/${fileName}`;
    //   const mockKey = `album/${user.id}/${Date.now()}/${fileName}`;
    //
    //   return {
    //     success: true,
    //     data: {
    //       uploadUrl: mockUploadUrl,
    //       key: mockKey,
    //       fields: {
    //         'Content-Type': contentType
    //       }
    //     }
    //   };
    // }

    // 프로덕션에서는 외부 API 호출
    const response = await fetch(PRESIGN_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`,
      },
      body: JSON.stringify({ fileName, contentType }),
    });
    console.log("PRESIGN_API_ENDPOINT >>> ", user);

    if (!response.ok) {
      throw new Error(`Presign API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  }, SUCCESS_MESSAGES.FILE_UPLOADED);
}
