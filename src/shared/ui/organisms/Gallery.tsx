"use client";

import React, { useState, useCallback, useRef } from "react";
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
  (
    {
      images,
      onImageClick,
      onImageLike,
      onImageDownload,
      onImageShare,
      onImageMore,
      onUploadClick,
      onSettingsClick,
      className,
      loading = false,
      hasMore = false,
      onLoadMore,
      filterOptions,
    },
    ref
  ) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilters, setSelectedFilters] = useState<string[]>(["all"]);
    const [viewMode, setViewMode] = useState<"grid" | "list" | "masonry">(
      "grid"
    );
    const [sortBy, setSortBy] = useState<
      "newest" | "oldest" | "title" | "likes"
    >("newest");

    const lastImageRef = useRef<HTMLDivElement | null>(null);

    // Filter and sort images
    const filteredImages = React.useMemo(() => {
      let filtered = images;

      // Search filter
      if (searchQuery) {
        filtered = filtered.filter(
          (image) =>
            image.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            image.description
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            image.tags?.some((tag) =>
              tag.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
      }

      // Category filters
      if (selectedFilters.length > 0 && !selectedFilters.includes("all")) {
        filtered = filtered.filter((image) => {
          if (selectedFilters.includes("recent")) {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            return new Date(image.date || "").getTime() > oneWeekAgo.getTime();
          }
          if (selectedFilters.includes("favorites")) {
            return image.isLiked;
          }
          if (selectedFilters.includes("tagged")) {
            return image.tags && image.tags.length > 0;
          }
          return true;
        });
      }

      // Sort
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return (
              new Date(b.date || "").getTime() -
              new Date(a.date || "").getTime()
            );
          case "oldest":
            return (
              new Date(a.date || "").getTime() -
              new Date(b.date || "").getTime()
            );
          case "title":
            return (a.title || "").localeCompare(b.title || "");
          case "likes":
            return (b.isLiked ? 1 : 0) - (a.isLiked ? 1 : 0);
          default:
            return 0;
        }
      });

      return filtered;
    }, [images, searchQuery, selectedFilters, sortBy]);

    // Infinite scroll
    const lastImageElementRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (loading) return;
        if (lastImageRef.current) lastImageRef.current.disconnect();

        lastImageRef.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && hasMore) {
            onLoadMore?.();
          }
        });

        if (node) lastImageRef.current.observe(node);
      },
      [loading, hasMore, onLoadMore]
    );

    const handleSortClick = () => {
      const sortOptions = ["newest", "oldest", "title", "likes"];
      const currentIndex = sortOptions.indexOf(sortBy);
      const nextIndex = (currentIndex + 1) % sortOptions.length;
      setSortBy(sortOptions[nextIndex] as typeof sortBy);
    };

    return <div ref={ref} className={cn("gallery", className)}></div>;
  }
);

Gallery.displayName = "Gallery";

export default Gallery;
