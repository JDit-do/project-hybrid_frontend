"use client";

import Gallery from "@/shared/ui/organisms/Gallery";

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

export default function GalleryContent({
  images,
  isLoading,
  onImageClick,
  onImageLike,
  onImageDownload,
  onImageShare,
  onImageMore,
  onUploadClick,
  onSettingsClick,
  onLoadMore,
}: {
  images: ImageData[];
  isLoading: boolean;
  onImageClick: (img: ImageData) => void;
  onImageLike: (id: string) => void;
  onImageDownload: (id: string) => void;
  onImageShare: (id: string) => void;
  onImageMore: (id: string) => void;
  onUploadClick: () => void;
  onSettingsClick: () => void;
  onLoadMore: () => void;
}) {
  return (
    <Gallery
      images={images}
      onImageClick={onImageClick}
      onImageLike={onImageLike}
      onImageDownload={onImageDownload}
      onImageShare={onImageShare}
      onImageMore={onImageMore}
      onUploadClick={onUploadClick}
      onSettingsClick={onSettingsClick}
      loading={isLoading}
      hasMore={false}
      onLoadMore={onLoadMore}
    />
  );
}
