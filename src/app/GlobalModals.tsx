"use client";

import UploadModal from "@/shared/ui/organisms/UploadModal";
import { useRouter } from "next/navigation";
import DetailModal from "@/shared/ui/organisms/DetailModal";
import { useModalStore } from "@/stores/modalStore";

export default function GlobalModals() {
  const { uploadOpen, detailOpen, detail, closeUpload, closeDetail } =
    useModalStore();
  const router = useRouter();

  return (
    <>
      <UploadModal
        open={uploadOpen}
        onClose={closeUpload}
        onUploaded={() => {
          try {
            router.refresh();
          } catch {}
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
