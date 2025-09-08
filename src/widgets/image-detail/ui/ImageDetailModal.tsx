'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, Heart, Calendar, Tag, ArrowLeft, ArrowRight } from 'lucide-react';
import Modal from '@/shared/ui/molecules/Modal';
import Button from '@/shared/ui/atoms/Button';

interface ImageItem {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  description?: string;
  createdAt: string;
  tags?: string[];
}

interface ImageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: ImageItem | null;
  images?: ImageItem[];
  currentIndex?: number;
  onNavigate?: (index: number) => void;
}

export default function ImageDetailModal({ 
  isOpen, 
  onClose, 
  image, 
  images = [], 
  currentIndex = 0,
  onNavigate 
}: ImageDetailModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (image) {
      setIsLoading(true);
      // Simulate loading
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [image]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !images.length) return;
      
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onNavigate?.(currentIndex - 1);
      } else if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
        onNavigate?.(currentIndex + 1);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length, currentIndex, onNavigate, onClose]);

  if (!image) return null;

  const canNavigateLeft = images.length > 0 && currentIndex > 0;
  const canNavigateRight = images.length > 0 && currentIndex < images.length - 1;

  const handleDownload = async () => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = image.title || 'image';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.title,
          text: image.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <div className="flex h-full">
        {/* Main Image Area */}
        <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-800 relative">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <motion.img
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              src={image.url}
              alt={image.title}
              className="max-w-full max-h-full object-contain"
            />
          )}

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              {canNavigateLeft && (
                <button
                  onClick={() => onNavigate?.(currentIndex - 1)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
              )}
              {canNavigateRight && (
                <button
                  onClick={() => onNavigate?.(currentIndex + 1)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                >
                  <ArrowRight className="h-6 w-6" />
                </button>
              )}
            </>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-2">{image.title}</h2>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date(image.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <Button
                onClick={() => setIsLiked(!isLiked)}
                variant={isLiked ? 'primary' : 'outline'}
                size="sm"
                className="flex-1"
              >
                <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                {isLiked ? '좋아요' : '좋아요'}
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Description */}
          {image.description && (
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium mb-2">설명</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {image.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {image.tags && image.tags.length > 0 && (
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium mb-3 flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                태그
              </h3>
              <div className="flex flex-wrap gap-2">
                {image.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Image Info */}
          <div className="p-6 flex-1">
            <h3 className="font-medium mb-3">이미지 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">파일 ID</span>
                <span className="font-mono text-xs">{image.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">업로드일</span>
                <span>{new Date(image.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
