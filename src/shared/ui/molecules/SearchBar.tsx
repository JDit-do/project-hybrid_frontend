import React, { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { motion } from "framer-motion";
import { SortAsc } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onFilterClick?: () => void;
  onSortClick?: () => void;
  showFilters?: boolean;
  showSort?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const SearchBar = React.forwardRef<HTMLDivElement, SearchBarProps>(
  ({ onSortClick, showSort = true, className, size = "md" }, ref) => {
    const [isFocused] = useState(false);

    const sizes = {
      sm: "search-bar--sm",
      md: "search-bar--md",
      lg: "search-bar--lg",
    };

    return (
      <div ref={ref} className={cn("search-bar", sizes[size], className)}>
        <div
          className={cn(
            "search-bar__container",
            isFocused && "search-bar__container--focused"
          )}
        >
          <div className="search-bar__actions">
            {showSort && onSortClick && (
              <motion.button
                onClick={onSortClick}
                className="search-bar__action"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="정렬 옵션"
              >
                <SortAsc className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";

export default SearchBar;
