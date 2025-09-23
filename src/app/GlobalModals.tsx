"use client";

import UploadModal from "@/shared/ui/organisms/UploadModal";
import { useRouter } from "next/navigation";
import DetailModal from "@/shared/ui/organisms/DetailModal";
import { useModalStore } from "@/stores/modalStore";

export default function GlobalModals() {
  const { uploadOpen, detailOpen, detail, onUploadComplete, closeUpload, closeDetail } =
    useModalStore();
  const router = useRouter();

  return (
    <>
      <UploadModal
        open={uploadOpen}
        onClose={closeUpload}
        onUploaded={() => {
          if (onUploadComplete) {
            onUploadComplete();
          } else {
            // 기본 동작: 페이지 새로고침
            try {
              router.refresh();
            } catch {}
          }
        }}
      />
      <DetailModal
        open={detailOpen}
        onClose={closeDetail}
        title={detail?.title}
        tags={detail?.tags}
        imageUrl={detail?.imageUrl}
      />
    </>
  );
}
