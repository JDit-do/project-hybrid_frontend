import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageCard from '@/shared/ui/atoms/ImageCard';

interface ImageData {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
  date?: string;
  tags?: string[];
  isLiked?: boolean;
}

export default function ImageGridItems({
  images,
  viewMode,
  itemClassName,
  onImageClick,
  onImageLike,
  onImageDownload,
  onImageShare,
  onImageMore,
  lastImageRef,
}: {
  images: ImageData[];
  viewMode: 'grid' | 'list' | 'masonry';
  itemClassName: string;
  onImageClick?: (image: ImageData) => void;
  onImageLike?: (imageId: string) => void;
  onImageDownload?: (imageId: string) => void;
  onImageShare?: (imageId: string) => void;
  onImageMore?: (imageId: string) => void;
  lastImageRef?: (node: HTMLDivElement | null) => void;
}) {
  return (
    <AnimatePresence>
      {images.map((image, index) => (
        <motion.div
          key={image.id}
          ref={index === images.length - 1 ? lastImageRef : null}
          className={itemClassName}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          layout
        >
          <ImageCard
            src={image.src}
            alt={image.alt}
            title={image.title}
            description={image.description}
            date={image.date}
            tags={image.tags}
            isLiked={image.isLiked}
            onClick={() => onImageClick?.(image)}
            onLike={() => onImageLike?.(image.id)}
            onDownload={() => onImageDownload?.(image.id)}
            onShare={() => onImageShare?.(image.id)}
            onMore={() => onImageMore?.(image.id)}
            variant={viewMode === 'list' ? 'compact' : 'default'}
            size={viewMode === 'list' ? 'sm' : 'md'}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}


