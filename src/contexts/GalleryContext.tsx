'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Image } from '@/entities/image/model/types';
import { useAppStore } from '@/stores/appStore';

export interface Album {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  imageCount: number;
  createdAt: string;
  updatedAt: string;
}

interface GalleryContextValue {
  // Current state
  currentAlbum: Album | null;
  selectedImages: string[];
  viewMode: 'grid' | 'list';
  sortBy: 'newest' | 'oldest' | 'title' | 'size';
  
  // Actions
  selectAlbum: (album: Album | null) => void;
  toggleImageSelection: (imageId: string) => void;
  selectAllImages: () => void;
  clearSelection: () => void;
  changeViewMode: (mode: 'grid' | 'list') => void;
  changeSortBy: (sortBy: 'newest' | 'oldest' | 'title' | 'size') => void;
  
  // Bulk actions
  deleteSelectedImages: () => void;
  addToAlbum: (albumId: string) => void;
  removeFromAlbum: (albumId: string) => void;
}

const GalleryContext = createContext<GalleryContextValue | null>(null);

interface GalleryProviderProps {
  children: ReactNode;
}

export const GalleryProvider: React.FC<GalleryProviderProps> = ({ children }) => {
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title' | 'size'>('newest');
  
  const { addNotification } = useAppStore();

  // Album actions
  const selectAlbum = useCallback((album: Album | null) => {
    setCurrentAlbum(album);
    setSelectedImages([]); // Clear selection when changing album
    
    if (album) {
      addNotification({
        type: 'info',
        title: '앨범 선택',
        message: `"${album.name}" 앨범을 선택했습니다.`,
        duration: 3000,
      });
    }
  }, [addNotification]);

  // Image selection actions
  const toggleImageSelection = useCallback((imageId: string) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  }, []);

  const selectAllImages = useCallback(() => {
    // This would need to be connected to the actual image list
    // For now, we'll just show a notification
    addNotification({
      type: 'info',
      title: '전체 선택',
      message: '모든 이미지를 선택했습니다.',
      duration: 2000,
    });
  }, [addNotification]);

  const clearSelection = useCallback(() => {
    setSelectedImages([]);
    addNotification({
      type: 'info',
      title: '선택 해제',
      message: '이미지 선택을 해제했습니다.',
      duration: 2000,
    });
  }, [addNotification]);

  // View and sort actions
  const changeViewMode = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode);
  }, []);

  const changeSortBy = useCallback((newSortBy: 'newest' | 'oldest' | 'title' | 'size') => {
    setSortBy(newSortBy);
    addNotification({
      type: 'info',
      title: '정렬 변경',
      message: `정렬 기준을 "${newSortBy}"로 변경했습니다.`,
      duration: 2000,
    });
  }, [addNotification]);

  // Bulk actions
  const deleteSelectedImages = useCallback(() => {
    if (selectedImages.length === 0) return;
    
    const count = selectedImages.length;
    setSelectedImages([]);
    
    addNotification({
      type: 'success',
      title: '이미지 삭제',
      message: `${count}개의 이미지를 삭제했습니다.`,
      duration: 3000,
    });
  }, [selectedImages, addNotification]);

  const addToAlbum = useCallback((albumId: string) => {
    if (selectedImages.length === 0) return;
    
    const count = selectedImages.length;
    setSelectedImages([]);
    
    addNotification({
      type: 'success',
      title: '앨범 추가',
      message: `${count}개의 이미지를 앨범에 추가했습니다.`,
      duration: 3000,
    });
  }, [selectedImages, addNotification]);

  const removeFromAlbum = useCallback((albumId: string) => {
    if (selectedImages.length === 0) return;
    
    const count = selectedImages.length;
    setSelectedImages([]);
    
    addNotification({
      type: 'success',
      title: '앨범 제거',
      message: `${count}개의 이미지를 앨범에서 제거했습니다.`,
      duration: 3000,
    });
  }, [selectedImages, addNotification]);

  const value: GalleryContextValue = {
    // State
    currentAlbum,
    selectedImages,
    viewMode,
    sortBy,
    
    // Actions
    selectAlbum,
    toggleImageSelection,
    selectAllImages,
    clearSelection,
    changeViewMode,
    changeSortBy,
    
    // Bulk actions
    deleteSelectedImages,
    addToAlbum,
    removeFromAlbum,
  };

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
};

export const useGalleryContext = (): GalleryContextValue => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGalleryContext must be used within a GalleryProvider');
  }
  return context;
};
