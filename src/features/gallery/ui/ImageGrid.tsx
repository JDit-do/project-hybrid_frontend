'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/shared/ui/molecules/Card';
import { Image as ImageType } from '@/entities/image/model/types';

interface ImageGridProps {
  images: ImageType[];
  viewMode: 'grid' | 'list';
  onImageClick: (image: ImageType) => void;
  lastImageRef?: (node: HTMLDivElement | null) => void;
}

export default function ImageGrid({
  images,
  viewMode,
  onImageClick,
  lastImageRef,
}: ImageGridProps) {
  if (viewMode === 'grid') {
    return (
      <div className="image-grid-enhanced">
        {images.map((image, index) => (
          <div
            key={image.id}
            ref={index === images.length - 1 ? lastImageRef : null}
            onClick={() => onImageClick(image)}
            className="image-item cursor-pointer"
          >
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
              <Image
                src={image.thumbnail}
                alt={image.title}
                fill
                className="image-thumbnail"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                priority={index < 8}
              />
              <div className="image-overlay">
                <h3 className="text-white font-semibold text-lg mb-1">
                  {image.title}
                </h3>
                <p className="text-white/80 text-sm">
                  {new Date(image.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {image.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(image.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {images.map((image, index) => (
        <div
          key={image.id}
          ref={index === images.length - 1 ? lastImageRef : null}
          onClick={() => onImageClick(image)}
          className="card-prism p-4 flex items-center space-x-4 cursor-pointer"
        >
          <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            <Image
              src={image.thumbnail}
              alt={image.title}
              fill
              className="object-cover"
              sizes="80px"
              priority={index < 8}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
              {image.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 line-clamp-2">
              {image.description}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {new Date(image.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}