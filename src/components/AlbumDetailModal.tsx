"use client";

import { useState, useEffect } from "react";
import { X, Share2, Calendar, Tag, Edit, Trash2, Brain } from "lucide-react";
import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";
import Image from "next/image";

interface AlbumItem {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  imageCount: number;
  tags?: string[];
  aiAnalysis?: {
    categories: string[];
    confidence: number;
    summary: string;
  };
  coverImage?: string;
}

interface AlbumDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  album: AlbumItem | null;
  onEdit?: (album: AlbumItem) => void;
  onDelete?: (albumId: string) => void;
}

export default function AlbumDetailModal({
  isOpen,
  onClose,
  album,
  onEdit,
  onDelete,
}: AlbumDetailModalProps) {
  const [, setIsLoading] = useState(true);

  useEffect(() => {
    if (album) {
      setIsLoading(true);
      // Simulate loading
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [album]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!album) return null;

  const handleEdit = () => {
    onEdit?.(album);
  };

  const handleDelete = () => {
    if (confirm("정말로 이 앨범을 삭제하시겠습니까?")) {
      onDelete?.(album.id);
      onClose();
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: album.title,
          text: album.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("링크가 클립보드에 복사되었습니다.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="flex flex-col h-full max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              앨범 상세 정보
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {album.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Album Cover */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
              {album.coverImage ? (
                <Image
                  src={album.coverImage}
                  alt={album.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <Tag className="h-8 w-8" />
                  </div>
                  <p>커버 이미지 없음</p>
                </div>
              )}
            </div>
          </div>

          {/* Album Info */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-lg mb-4">{album.title}</h3>
            {album.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {album.description}
              </p>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  생성일: {new Date(album.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <Tag className="h-4 w-4 mr-2" />
                <span>이미지 수: {album.imageCount}개</span>
              </div>
            </div>
          </div>

          {/* AI Analysis */}
          {album.aiAnalysis && (
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <Brain className="h-5 w-5 mr-2 text-blue-600" />
                AI 분석 결과
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {album.aiAnalysis.summary}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span>
                      신뢰도: {Math.round(album.aiAnalysis.confidence * 100)}%
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">분석된 카테고리:</h4>
                  <div className="flex flex-wrap gap-2">
                    {album.aiAnalysis.categories.map((category, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          {album.tags && album.tags.length > 0 && (
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                태그
              </h3>
              <div className="flex flex-wrap gap-2">
                {album.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-3">
            <Button onClick={handleEdit} variant="outline" className="flex-1">
              <Edit className="h-4 w-4 mr-2" />
              편집
            </Button>
            <Button onClick={handleShare} variant="outline" className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              공유
            </Button>
            <Button
              onClick={handleDelete}
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              삭제
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
