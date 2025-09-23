'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  sizes,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
}: OptimizedImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // 이미지 로드 에러 처리 (WebP → JPG → PNG fallback)
  const handleError = useCallback(() => {
    if (currentSrc.includes('.webp')) {
      // WebP에서 JPG로 fallback
      const jpgSrc = currentSrc.replace('.webp', '.jpg');
      setCurrentSrc(jpgSrc);
    } else if (currentSrc.includes('.jpg')) {
      // JPG에서 PNG로 fallback
      const pngSrc = currentSrc.replace('.jpg', '.png');
      setCurrentSrc(pngSrc);
    } else {
      // 모든 포맷 실패 시 에러 상태
      setHasError(true);
      setIsLoading(false);
    }
  }, [currentSrc]);

  // 이미지 로드 성공 처리
  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  // 에러 상태일 때 표시할 내용
  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}
        style={fill ? {} : { width, height }}
      >
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-2xl mb-2">📷</div>
          <div className="text-sm">이미지를 불러올 수 없습니다</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 animate-pulse"
          style={fill ? {} : { width, height }}
        >
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      
      <Image
        src={currentSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        priority={priority}
        sizes={sizes}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onError={handleError}
        onLoad={handleLoad}
        unoptimized={false} // Next.js Image Optimization 사용
      />
    </div>
  );
}

