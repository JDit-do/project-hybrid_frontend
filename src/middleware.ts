import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(_req) {
    // 토큰이 유효한 경우 요청을 계속 진행
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // 보호된 경로에 대한 접근 권한 확인
        const { pathname } = req.nextUrl;

        // 보호된 경로들
        const protectedPaths = ["/dashboard", "/gallery", "/upload"];
        const isProtectedPath = protectedPaths.some((path) =>
          pathname.startsWith(path)
        );

        // 토큰이 있고 유효한 경우에만 접근 허용
        if (isProtectedPath) {
          return !!token;
        }

        // 공개 경로는 항상 허용
        return true;
      },
    },
  }
);

// 보호된 경로 설정
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/gallery/:path*",
    "/upload/:path*",
    "/admin/:path*",
    "/api/gallery/:path*",
    "/api/upload/:path*",
  ],
};










