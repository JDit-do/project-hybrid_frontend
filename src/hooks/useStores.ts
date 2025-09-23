// 통합 스토어 훅
import { useAuthStore, useAppStore } from "@/stores";
import { useGalleryContext, useUploadContext } from "@/contexts";

/**
 * 모든 전역 상태와 도메인별 상태를 통합하는 훅
 * 컴포넌트에서 필요한 상태만 선택적 사용 가능.
 */
export const useStores = () => {
  // Zustand 전역 스토어
  const auth = useAuthStore();
  const app = useAppStore();

  // Context API 도메인별 상태
  const gallery = useGalleryContext();
  const upload = useUploadContext();

  return {
    // 전역 상태 (Zustand)
    auth,
    app,

    // 도메인별 상태 (Context API)
    gallery,
    upload,
  };
};

/**
 * 인증 관련 상태만 사용하는 훅
 */
export const useAuth = () => {
  return useAuthStore();
};

/**
 * 앱 전역 상태만 사용하는 훅
 */
export const useApp = () => {
  return useAppStore();
};

/**
 * 갤러리 관련 상태만 사용하는 훅
 */
export const useGallery = () => {
  return useGalleryContext();
};

/**
 * 업로드 관련 상태만 사용하는 훅
 */
export const useUpload = () => {
  return useUploadContext();
};
