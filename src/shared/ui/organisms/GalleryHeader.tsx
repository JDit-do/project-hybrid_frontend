import React, { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "@/shared/ui/molecules/SearchBar";
import FilterGroup from "@/shared/ui/molecules/FilterGroup";
import ViewToggle from "@/shared/ui/atoms/ViewToggle";
import { Filter, SortAsc, Settings, Upload } from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

interface GalleryHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFilters: string[];
  onFiltersChange: (filters: string[]) => void;
  viewMode: "grid" | "list" | "masonry";
  onViewModeChange: (mode: "grid" | "list" | "masonry") => void;
  filterOptions?: FilterOption[];
  onUploadClick?: () => void;
  onSettingsClick?: () => void;
  onSortClick?: () => void;
  className?: string;
  showUploadButton?: boolean;
  showSettingsButton?: boolean;
}

const GalleryHeader = React.forwardRef<HTMLDivElement, GalleryHeaderProps>(
  (
    {
      searchQuery,
      onSearchChange,
      selectedFilters,
      onFiltersChange,
      viewMode,
      onViewModeChange,
      filterOptions = [],
      onUploadClick,
      onSettingsClick,
      onSortClick,
      className,
      showUploadButton = true,
      showSettingsButton = false,
    },
    ref
  ) => {
    const [showFilters, setShowFilters] = useState(false);

    const defaultFilterOptions: FilterOption[] = [
      { id: "all", label: "전체", count: 0 },
      { id: "recent", label: "최근", count: 0 },
      { id: "tagged", label: "AI추천", count: 0 },
    ];

    const filters =
      filterOptions.length > 0 ? filterOptions : defaultFilterOptions;

    return (
      <div ref={ref} className={cn("gallery-header", className)}>
        {/* Main Header */}
        <div className="gallery-header__main">
          <div className="gallery-header__search">
            <SearchBar
              value={searchQuery}
              onChange={onSearchChange}
              onFilterClick={() => setShowFilters(!showFilters)}
              onSortClick={onSortClick}
              placeholder="이미지 검색..."
            />
          </div>

          <div className="gallery-header__actions">
            {showUploadButton && onUploadClick && (
              <motion.button
                onClick={onUploadClick}
                className="gallery-header__action gallery-header__action--primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="이미지 업로드"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">업로드</span>
              </motion.button>
            )}

            {showSettingsButton && onSettingsClick && (
              <motion.button
                onClick={onSettingsClick}
                className="gallery-header__action"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="설정"
              >
                <Settings className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

GalleryHeader.displayName = "GalleryHeader";

export default GalleryHeader;
