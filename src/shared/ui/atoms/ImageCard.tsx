import React from 'react';
import { cn } from '@/shared/lib/utils';
import { motion } from 'framer-motion';
import { Heart, MoreVertical, Download, Share2 } from 'lucide-react';

interface ImageCardProps {
  src: string;
  alt: string;
  title?: string;
  description?: string;
  date?: string;
  tags?: string[];
  isLiked?: boolean;
  onLike?: () => void;
  onMore?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'compact' | 'featured';
  size?: 'sm' | 'md' | 'lg';
}

const ImageCard = React.forwardRef<HTMLDivElement, ImageCardProps>(
  ({
    src,
    alt,
    title,
    description,
    date,
    tags = [],
    isLiked = false,
    onLike,
    onMore,
    onDownload,
    onShare,
    onClick,
    className,
    variant = 'default',
    size = 'md',
    ...props
  }, ref) => {
    const variants = {
      default: 'image-card',
      compact: 'image-card image-card--compact',
      featured: 'image-card image-card--featured'
    };

    const sizes = {
      sm: 'image-card--sm',
      md: 'image-card--md',
      lg: 'image-card--lg'
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          variants[variant],
          sizes[size],
          className
        )}
        onClick={onClick}
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        {...props}
      >
        <div className="image-card__container">
          <img
            src={src}
            alt={alt}
            className="image-card__image"
            loading="lazy"
          />
          
          {/* Image Overlay */}
          <div className="image-card__overlay">
            <div className="image-card__actions">
              {onLike && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLike();
                  }}
                  className={cn(
                    'image-card__action',
                    isLiked && 'image-card__action--active'
                  )}
                  aria-label={isLiked ? '좋아요 취소' : '좋아요'}
                >
                  <Heart className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} />
                </button>
              )}
              
              {onDownload && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload();
                  }}
                  className="image-card__action"
                  aria-label="다운로드"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
              
              {onShare && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare();
                  }}
                  className="image-card__action"
                  aria-label="공유"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              )}
              
              {onMore && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMore();
                  }}
                  className="image-card__action"
                  aria-label="더보기"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="image-card__tags">
              {tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="image-card__tag">
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="image-card__tag image-card__tag--more">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        {(title || description || date) && (
          <div className="image-card__content">
            {title && (
              <h3 className="image-card__title">{title}</h3>
            )}
            {description && (
              <p className="image-card__description">{description}</p>
            )}
            {date && (
              <p className="image-card__date">{date}</p>
            )}
          </div>
        )}
      </motion.div>
    );
  }
);

ImageCard.displayName = 'ImageCard';

export default ImageCard;






