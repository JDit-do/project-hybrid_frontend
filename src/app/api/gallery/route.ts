import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * 갤러리 이미지 목록 조회 API
 * GET /api/gallery
 */
export async function GET(request: NextRequest) {
  try {
    // JWT 토큰에서 accessToken 가져오기 (자동 갱신됨)
    const token = await getToken({ req: request });
    if (!token || !token.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 토큰 정보 로깅 (개발 환경)
    if (process.env.NODE_ENV === "development") {
      console.log("🔑 Gallery API - Token info:", {
        hasAccessToken: !!token.accessToken,
        expiresAt: token.expiresAt,
        timeUntilExpiry: token.expiresAt
          ? Math.floor((token.expiresAt as number) * 1000 - Date.now()) / 1000
          : "unknown",
      });
    }

    // 외부 API 호출
    const baseUrl =
      process.env.NEXT_PUBLIC_PRESIGN_API || "https://api.prism-memory.cloud";
    // const apiUrl = `${baseUrl}/images?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}`;
    const apiUrl = `${baseUrl}/images`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching gallery images:", error);

    // 에러 시 목업 데이터 반환 (개발 환경)
    if (process.env.NODE_ENV === "development") {
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "20");
      const mockData = generateMockImages(page, limit);
      return NextResponse.json(mockData);
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * 목업 이미지 데이터 생성
 * TODO: 실제 데이터베이스 연동 시 제거
 */
function generateMockImages(page: number, limit: number) {
  const images = [];
  const startIndex = (page - 1) * limit;

  for (let i = 0; i < limit; i++) {
    const index = startIndex + i;
    images.push({
      id: `image-${index}`,
      url: `https://picsum.photos/400/400?random=${index}`,
      title: `이미지 ${index + 1}`,
      description: `이미지 설명 ${index + 1}`,
      createdAt: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      size: Math.floor(Math.random() * 5 * 1024 * 1024) + 1024 * 1024, // 1MB ~ 5MB
      type: "image/jpeg",
      tags: ["태그1", "태그2"],
      isFavorite: Math.random() > 0.7,
    });
  }

  return {
    images,
    pagination: {
      page,
      limit,
      total: 100,
      totalPages: Math.ceil(100 / limit),
    },
  };
}
