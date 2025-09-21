"use client";

import { Session } from "next-auth";
import ModernGalleryClient from "./ModernGalleryClient";
import { useGalleryImages } from "@/features/gallery/model/useGalleryImages";

interface GalleryListProps {
  session: Session | null;
}

export default function GalleryList({ session }: GalleryListProps) {
  const albumId = session?.sub;
  const { images, loading, error } = useGalleryImages({
    albumId,
    accessToken: session?.accessToken,
  });

  if (loading) return "로딩 중...";
  if (error) return `에러: ${error.message}`;

  return <ModernGalleryClient initialImages={images} userId={albumId} />;
}
