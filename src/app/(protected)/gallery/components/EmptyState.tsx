"use client";

import { motion } from "framer-motion";

export default function EmptyState({ onUploadClick }: { onUploadClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="modern-gallery__empty"
    >
      <div className="modern-gallery__empty-content">
        <div className="modern-gallery__empty-icon">
          <svg
            className="w-16 h-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="modern-gallery__empty-title">아직 업로드된 이미지가 없습니다</h3>
        <p className="modern-gallery__empty-description">첫 번째 추억을 업로드해보세요!</p>
        <motion.button
          onClick={onUploadClick}
          className="gallery-header__action gallery-header__action--primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          업로드하기
        </motion.button>
      </div>
    </motion.div>
  );
}






