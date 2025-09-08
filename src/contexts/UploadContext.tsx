'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useAppStore } from '@/stores/appStore';

export interface UploadProgress {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
  uploadedAt?: Date;
}

interface UploadContextValue {
  // State
  uploads: UploadProgress[];
  isUploading: boolean;
  dragActive: boolean;
  uploadStats: {
    total: number;
    success: number;
    error: number;
    uploading: number;
  };
  
  // Actions
  addUpload: (file: File) => void;
  updateUploadProgress: (id: string, progress: number) => void;
  updateUploadStatus: (id: string, status: UploadProgress['status'], error?: string) => void;
  removeUpload: (id: string) => void;
  retryUpload: (id: string) => void;
  clearCompletedUploads: () => void;
  clearAllUploads: () => void;
  
  // Drag and drop
  setDragActive: (active: boolean) => void;
  
  // Batch operations
  uploadFiles: (files: File[]) => void;
  cancelAllUploads: () => void;
}

const UploadContext = createContext<UploadContextValue | null>(null);

interface UploadProviderProps {
  children: ReactNode;
}

export const UploadProvider: React.FC<UploadProviderProps> = ({ children }) => {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const { addNotification } = useAppStore();

  // Calculate upload stats
  const uploadStats = {
    total: uploads.length,
    success: uploads.filter(u => u.status === 'success').length,
    error: uploads.filter(u => u.status === 'error').length,
    uploading: uploads.filter(u => u.status === 'uploading').length,
  };

  // Upload actions
  const addUpload = useCallback((file: File) => {
    const upload: UploadProgress = {
      id: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      progress: 0,
      status: 'uploading',
    };

    setUploads(prev => [...prev, upload]);
    setIsUploading(true);

    addNotification({
      type: 'info',
      title: '업로드 시작',
      message: `"${file.name}" 업로드를 시작했습니다.`,
      duration: 2000,
    });

    return upload.id;
  }, [addNotification]);

  const updateUploadProgress = useCallback((id: string, progress: number) => {
    setUploads(prev => prev.map(upload =>
      upload.id === id ? { ...upload, progress } : upload
    ));
  }, []);

  const updateUploadStatus = useCallback((
    id: string, 
    status: UploadProgress['status'], 
    error?: string
  ) => {
    setUploads(prev => prev.map(upload =>
      upload.id === id 
        ? { 
            ...upload, 
            status, 
            ...(error && { error }),
            ...(status === 'success' && { uploadedAt: new Date() })
          }
        : upload
    ));

    // Update global uploading state
    const remainingUploads = uploads.filter(u => u.status === 'uploading');
    if (remainingUploads.length === 0) {
      setIsUploading(false);
    }

    // Show notifications
    const upload = uploads.find(u => u.id === id);
    if (upload) {
      if (status === 'success') {
        addNotification({
          type: 'success',
          title: '업로드 완료',
          message: `"${upload.file.name}" 업로드가 완료되었습니다.`,
          duration: 3000,
        });
      } else if (status === 'error') {
        addNotification({
          type: 'error',
          title: '업로드 실패',
          message: `"${upload.file.name}" 업로드에 실패했습니다.`,
          duration: 5000,
        });
      }
    }
  }, [uploads, addNotification]);

  const removeUpload = useCallback((id: string) => {
    setUploads(prev => prev.filter(upload => upload.id !== id));
    
    addNotification({
      type: 'info',
      title: '업로드 제거',
      message: '업로드를 목록에서 제거했습니다.',
      duration: 2000,
    });
  }, [addNotification]);

  const retryUpload = useCallback((id: string) => {
    setUploads(prev => prev.map(upload =>
      upload.id === id 
        ? { ...upload, status: 'uploading', progress: 0, error: undefined }
        : upload
    ));

    const upload = uploads.find(u => u.id === id);
    if (upload) {
      addNotification({
        type: 'info',
        title: '업로드 재시도',
        message: `"${upload.file.name}" 업로드를 재시도합니다.`,
        duration: 2000,
      });
    }
  }, [uploads, addNotification]);

  const clearCompletedUploads = useCallback(() => {
    setUploads(prev => prev.filter(upload => upload.status === 'uploading'));
    
    addNotification({
      type: 'info',
      title: '완료된 업로드 정리',
      message: '완료된 업로드를 목록에서 제거했습니다.',
      duration: 2000,
    });
  }, [addNotification]);

  const clearAllUploads = useCallback(() => {
    setUploads([]);
    setIsUploading(false);
    
    addNotification({
      type: 'info',
      title: '업로드 목록 초기화',
      message: '모든 업로드를 목록에서 제거했습니다.',
      duration: 2000,
    });
  }, [addNotification]);

  // Batch operations
  const uploadFiles = useCallback((files: File[]) => {
    files.forEach(file => addUpload(file));
  }, [addUpload]);

  const cancelAllUploads = useCallback(() => {
    setUploads(prev => prev.map(upload =>
      upload.status === 'uploading' 
        ? { ...upload, status: 'error', error: '사용자에 의해 취소됨' }
        : upload
    ));
    setIsUploading(false);
    
    addNotification({
      type: 'warning',
      title: '업로드 취소',
      message: '모든 진행 중인 업로드를 취소했습니다.',
      duration: 3000,
    });
  }, [addNotification]);

  const value: UploadContextValue = {
    // State
    uploads,
    isUploading,
    dragActive,
    uploadStats,
    
    // Actions
    addUpload,
    updateUploadProgress,
    updateUploadStatus,
    removeUpload,
    retryUpload,
    clearCompletedUploads,
    clearAllUploads,
    
    // Drag and drop
    setDragActive,
    
    // Batch operations
    uploadFiles,
    cancelAllUploads,
  };

  return (
    <UploadContext.Provider value={value}>
      {children}
    </UploadContext.Provider>
  );
};

export const useUploadContext = (): UploadContextValue => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error('useUploadContext must be used within an UploadProvider');
  }
  return context;
};
