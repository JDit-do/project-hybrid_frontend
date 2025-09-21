import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ModernGalleryPage from "./ModernGalleryPage";

/**
 * 갤러리 페이지 - Server Component
 * 헤더와 레이아웃은 서버에서 렌더링
 */
export default async function GalleryPage() {
  // 서버에서 session 가져오기
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">갤러리</h1>
              <p className="text-gray-500 mt-1">당신의 소중한 추억들</p>
            </div>
            <Link
              href="/upload"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              업로드
            </Link>
          </div>
        </div>

        {/* 갤러리 콘텐츠 */}
        <ModernGalleryPage session={session} />
      </div>
    </div>
  );
}
