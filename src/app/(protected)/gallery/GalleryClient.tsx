"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface ImageData {
  AlbumID: string;
  CreatedAt: string;
  ImageSummary?: string | null;
  OriginalKey: string;
  Tags?: string[] | null;
  OriginalPresignedUrl?: string | null;
  ProcessedPresignedUrl?: string | null;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface GalleryClientProps {
  initialImages: ImageData[];
  pagination?: PaginationData;
}

/**
 * 갤러리 클라이언트 컴포넌트 - 모던 UI 디자인
 * CSR로 상호작용 처리 (필터링, 정렬, 무한스크롤 등)
 */
export default function GalleryClient({ initialImages }: GalleryClientProps) {
  const [images] = useState<ImageData[]>(initialImages);
  const [filter, setFilter] = useState<"all" | "recent" | "tagged">("all");
  const [sortBy, setSortBy] = useState<"date" | "summary" | "tags">("date");
  const [isLoading, setIsLoading] = useState(false);

  // 필터링된 이미지 목록
  const filteredImages = images.filter((image) => {
    switch (filter) {
      case "recent":
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return new Date(image.CreatedAt) > oneWeekAgo;
      case "tagged":
        return image.Tags && image.Tags.length > 0;
      default:
        return true;
    }
  });

  // 정렬된 이미지 목록
  const sortedImages = [...filteredImages].sort((a, b) => {
    switch (sortBy) {
      case "summary":
        return (a.ImageSummary || "").localeCompare(b.ImageSummary || "");
      case "tags":
        return (b.Tags?.length || 0) - (a.Tags?.length || 0);
      case "date":
      default:
        return (
          new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime()
        );
    }
  });

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // TODO: API 호출로 최신 데이터 가져오기
      // const newImages = await fetchImages();
      // setImages(newImages);
    } catch (error) {
      console.error("Error refreshing images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 빈 상태 UI 렌더링
  const renderEmptyState = (
    message: string,
    description: string,
    showRefresh = true
  ) => (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
      <p className="text-gray-500 mb-4">{description}</p>
      {showRefresh && (
        <button
          onClick={handleRefresh}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          새로고침
        </button>
      )}
    </div>
  );

  // 전체 이미지가 없는 경우
  if (images.length === 0) {
    return renderEmptyState(
      "아직 업로드된 이미지가 없습니다",
      "첫 번째 추억을 업로드해보세요!",
      true
    );
  }

  // 필터링된 결과가 없는 경우
  if (sortedImages.length === 0) {
    const filterMessages = {
      all: "모든 이미지",
      recent: "최근 7일 내 이미지",
      tagged: "태그가 있는 이미지",
    };

    return (
      <div className="space-y-6">
        {/* 필터 및 정렬 컨트롤 */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                전체
              </button>
              <button
                onClick={() => setFilter("recent")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === "recent"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                최근
              </button>
              <button
                onClick={() => setFilter("tagged")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === "tagged"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                태그됨
              </button>
            </div>

            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-600">정렬:</span>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "date" | "summary" | "tags")
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="date">날짜순</option>
                <option value="summary">요약순</option>
                <option value="tags">태그순</option>
              </select>
            </div>
          </div>
        </div>

        {renderEmptyState(
          `${filterMessages[filter]}가 없습니다`,
          "다른 필터를 선택하거나 새 이미지를 업로드해보세요.",
          false
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 필터 및 정렬 컨트롤 */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setFilter("recent")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === "recent"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              최근
            </button>
            <button
              onClick={() => setFilter("tagged")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === "tagged"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              태그됨
            </button>
          </div>

          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-600">정렬:</span>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "date" | "summary" | "tags")
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date">날짜순</option>
              <option value="summary">요약순</option>
              <option value="tags">태그순</option>
            </select>
          </div>
        </div>
      </div>

      {/* 이미지 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {sortedImages.map((image, index) => (
          <Link
            key={`image${index}`}
            href={`/gallery/${image.AlbumID}`}
            className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="aspect-square relative">
              <Image
                src={
                  image.ProcessedPresignedUrl ||
                  image.OriginalPresignedUrl ||
                  "/placeholder-image.jpg"
                }
                alt={image.ImageSummary || "이미지"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
              />
            </div>

            {/* 이미지 정보 */}
            <div className="p-3">
              <h3 className="font-medium text-sm text-gray-900 mb-2 line-clamp-2">
                {image.ImageSummary || "AI가 분석한 이미지"}
              </h3>

              {/* 태그 */}
              {image.Tags && image.Tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {image.Tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {image.Tags.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{image.Tags.length - 2}
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  {new Date(image.CreatedAt).toLocaleDateString("ko-KR")}
                </span>
                <div className="flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>AI</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 새로고침 버튼 */}
      <div className="text-center pt-4">
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              새로고침 중...
            </>
          ) : (
            "새로고침"
          )}
        </button>
      </div>
    </div>
  );
}
