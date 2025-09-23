"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";
import { ImageData } from "@/shared/ui/organisms/ImageGrid";

interface GalleryProps {
  images: ImageData[];
  onImageClick?: (image: ImageData) => void;
  onImageLike?: (imageId: string) => void;
  onImageDownload?: (imageId: string) => void;
  onImageShare?: (imageId: string) => void;
  onImageMore?: (imageId: string) => void;
  onUploadClick?: () => void;
  onSettingsClick?: () => void;
  className?: string;
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  filterOptions?: Array<{
    id: string;
    label: string;
    count?: number;
    disabled?: boolean;
  }>;
}

const Gallery = React.forwardRef<HTMLDivElement, GalleryProps>(
  ({ className }, ref) => {
    return <div ref={ref} className={cn("gallery", className)}></div>;
  }
);

Gallery.displayName = "Gallery";

export default Gallery;
