import React from "react";
import { cn } from "@/shared/lib/utils";
import ImageGridEmpty from "@/shared/ui/organisms/ImageGridEmpty";
import ImageGridItems from "@/shared/ui/organisms/ImageGridItems";

export interface ImageData {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
  date?: string;
  tags?: string[];
  isLiked?: boolean;
}

interface ImageGridProps {
  images: ImageData[];
  viewMode: "grid" | "list" | "masonry";
  onImageClick?: (image: ImageData) => void;
  onImageLike?: (imageId: string) => void;
  onImageDownload?: (imageId: string) => void;
  onImageShare?: (imageId: string) => void;
  onImageMore?: (imageId: string) => void;
  className?: string;
  loading?: boolean;
  lastImageRef?: (node: HTMLDivElement | null) => void;
}

const ImageGrid = React.forwardRef<HTMLDivElement, ImageGridProps>(
  (
    {
      images,
      viewMode,
      onImageClick,
      onImageLike,
      onImageDownload,
      onImageShare,
      onImageMore,
      className,
      loading = false,
      lastImageRef,
    },
    ref
  ) => {
    const containerVariants = {
      grid: "image-grid image-grid--grid",
      list: "image-grid image-grid--list",
      masonry: "image-grid image-grid--masonry",
    };

    const itemVariants = {
      grid: "image-grid__item image-grid__item--grid",
      list: "image-grid__item image-grid__item--list",
      masonry: "image-grid__item image-grid__item--masonry",
    };

    if (loading && images.length === 0) {
      return (
        <div ref={ref} className={cn("image-grid", className)}>
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="image-grid__skeleton" />
          ))}
        </div>
      );
    }

    if (images.length === 0) {
      return <ImageGridEmpty ref={ref} className={className} />;
    }

    return (
      <div ref={ref} className={cn(containerVariants[viewMode], className)}>
        <ImageGridItems
          images={images}
          viewMode={viewMode}
          itemClassName={itemVariants[viewMode]}
          onImageClick={onImageClick}
          onImageLike={onImageLike}
          onImageDownload={onImageDownload}
          onImageShare={onImageShare}
          onImageMore={onImageMore}
          lastImageRef={lastImageRef}
        />
      </div>
    );
  }
);

ImageGrid.displayName = "ImageGrid";

export default ImageGrid;
