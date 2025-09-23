"use client";

import { create } from "zustand";

export interface DetailPayload {
  title?: string;
  tags?: string[];
  imageUrl?: string;
}

interface ModalState {
  uploadOpen: boolean;
  detailOpen: boolean;
  detail: DetailPayload | null;
  onUploadComplete?: () => void;
  openUpload: (onUploadComplete?: () => void) => void;
  closeUpload: () => void;
  openDetail: (detail?: DetailPayload) => void;
  closeDetail: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  uploadOpen: false,
  detailOpen: false,
  detail: null,
  onUploadComplete: undefined,
  openUpload: (onUploadComplete) => set({ uploadOpen: true, onUploadComplete }),
  closeUpload: () => set({ uploadOpen: false, onUploadComplete: undefined }),
  openDetail: (detail) => set({ detailOpen: true, detail: detail ?? null }),
  closeDetail: () => set({ detailOpen: false, detail: null }),
}));


