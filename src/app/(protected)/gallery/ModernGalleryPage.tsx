"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AppLayout from "@/shared/ui/organisms/AppLayout";
import ModernGalleryClient from "./ModernGalleryClient";
import { type GalleryImageItem } from "@/features/gallery/api/queries";

interface ModernGalleryPageProps {
  initialImages: GalleryImageItem[];
}

export default function ModernGalleryPage({
  initialImages,
}: ModernGalleryPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Auth check
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/onboarding");
    }
  }, [status, router]);

  const handleLogout = () => {
    signOut({ callbackUrl: "/api/auth/logout-redirect" });
  };

  const handleUploadClick = () => {
    router.push("/upload");
  };

  if (status === "loading") {
    return (
      <div className="app-layout__loading">
        <div className="app-layout__spinner" />
        <p>로딩 중...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <AppLayout
      currentPage="gallery"
      onLogout={handleLogout}
      onUploadClick={handleUploadClick}
    >
      <ModernGalleryClient initialImages={initialImages} />
    </AppLayout>
  );
}
