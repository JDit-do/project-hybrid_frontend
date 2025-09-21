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
  openUpload: () => void;
  closeUpload: () => void;
  openDetail: (detail?: DetailPayload) => void;
  closeDetail: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  uploadOpen: false,
  detailOpen: false,
  detail: null,
  openUpload: () => set({ uploadOpen: true }),
  closeUpload: () => set({ uploadOpen: false }),
  openDetail: (detail) => set({ detailOpen: true, detail: detail ?? null }),
  closeDetail: () => set({ detailOpen: false, detail: null }),
}));


