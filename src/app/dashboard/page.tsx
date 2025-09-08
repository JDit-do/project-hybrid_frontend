"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/shared/ui/organisms/Header";
import GalleryControls from "@/features/gallery/ui/GalleryControls";
import ImageGrid from "@/features/gallery/ui/ImageGrid";
import ImageUploadModal from "@/widgets/upload-modal/ui/ImageUploadModal";
import ImageDetailModal from "@/widgets/image-detail/ui/ImageDetailModal";
import { useGallery } from "@/features/gallery/model/useGallery";
import { useUpload } from "@/features/upload/model/useUpload";
import { useSearch } from "@/features/search/model/useSearch";
import ErrorAlert from "@/shared/ui/molecules/ErrorAlert";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Gallery business logic
  const {
    images,
    loading,
    hasMore,
    viewMode,
    selectedImage,
    isInitialLoad,
    errorState,
    canRetry,
    loadImages,
    loadMore,
    setFilteredImages,
    changeViewMode,
    selectImage,
    retry,
    clearError,
  } = useGallery();

  // Search business logic
  const { searchImages } = useSearch();

  // Upload business logic
  const {
    uploads,
    isUploading,
    dragActive,
    uploadFiles,
    removeUpload,
    resetUploads,
    handleDrag,
    handleDrop,
  } = useUpload({
    onSuccess: () => {
      // Refresh gallery after successful upload
      loadImages(true);
    },
  });

  // Auth check
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      loadImages(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, router]); // loadImages는 useCallback으로 메모이제이션되어 있어서 의존성에서 제외

  // Loading state
  if (status === "loading") {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <Header
        onUploadClick={() => {
          /* TODO: Open upload modal */
        }}
        onLogout={() => router.push("/logout")}
      />

      <div className="dashboard-content">
        {/* Gallery Controls */}
        <div className="gallery-controls-wrapper">
          <GalleryControls
            images={images}
            onFilteredImagesChange={setFilteredImages}
            viewMode={viewMode}
            onViewModeChange={changeViewMode}
          />
        </div>

        {/* Image Grid */}
        <ImageGrid
          images={images}
          viewMode={viewMode}
          onImageClick={selectImage}
          lastImageRef={(node) => {
            // Intersection observer for infinite scroll
            if (node && hasMore && !loading) {
              const observer = new IntersectionObserver(
                (entries) => {
                  if (entries[0].isIntersecting) {
                    loadMore();
                  }
                },
                { threshold: 0.1 }
              );
              observer.observe(node);
            }
          }}
        />

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="spinner-prism"></div>
          </div>
        )}

        {/* End of data indicator */}
        {!hasMore && images.length > 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            모든 이미지를 불러왔습니다.
          </div>
        )}

        {/* Empty state */}
        {!loading &&
          !isInitialLoad &&
          images.length === 0 &&
          !errorState.hasError && (
            <div className="empty-state-prism">
              <div className="empty-icon">
                <span className="empty-emoji">📷</span>
              </div>
              <h3 className="empty-title">이미지가 없습니다</h3>
              <p className="empty-description">
                첫 번째 이미지를 업로드해보세요!
              </p>
            </div>
          )}
      </div>

      {/* Modals */}
      <ImageUploadModal
        isOpen={false} // TODO: Connect to upload state
        onClose={() => {
          /* TODO: Close upload modal */
        }}
        onUploadSuccess={() => {
          // TODO: Handle upload success
        }}
      />

      <ImageDetailModal
        isOpen={!!selectedImage}
        onClose={() => selectImage(null)}
        image={selectedImage}
      />

      {/* Error Alert */}
      <ErrorAlert
        isOpen={errorState.hasError}
        message={errorState.message}
        code={errorState.code}
        retryCount={errorState.retryCount}
        maxRetries={3}
        onRetry={canRetry ? retry : undefined}
        onClose={clearError}
      />
    </div>
  );
}
