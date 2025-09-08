'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { UploadService, UploadState, UploadOptions, UploadProgress } from './UploadService';

export type { UploadProgress };

export function useUpload(options: UploadOptions = {}) {
  const [state, setState] = useState<UploadState>(() => {
    const service = new UploadService(options);
    return service.getState();
  });
  
  const serviceRef = useRef<UploadService | null>(null);

  // Initialize service
  useEffect(() => {
    serviceRef.current = new UploadService(options);
    
    // Subscribe to state changes
    const unsubscribe = serviceRef.current.subscribe((newState) => {
      setState(newState);
    });

    return () => {
      unsubscribe();
      serviceRef.current?.destroy();
    };
  }, [options?.maxFileSize]); // 함수 제거하고 필요한 것만 유지
  // eslint-disable-next-line react-hooks/exhaustive-deps

  // Upload files
  const uploadFiles = useCallback(async (files: File[]) => {
    await serviceRef.current?.uploadFiles(files);
  }, []);

  // Remove upload
  const removeUpload = useCallback((id: string) => {
    serviceRef.current?.removeUpload(id);
  }, []);

  // Reset uploads
  const resetUploads = useCallback(() => {
    serviceRef.current?.resetUploads();
  }, []);

  // Retry upload
  const retryUpload = useCallback(async (id: string) => {
    await serviceRef.current?.retryUpload(id);
  }, []);

  // Drag handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    serviceRef.current?.handleDrag(e);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    serviceRef.current?.handleDrop(e);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    serviceRef.current?.clearError();
  }, []);

  // Get upload stats
  const getUploadStats = useCallback(() => {
    return serviceRef.current?.getUploadStats() || { total: 0, success: 0, error: 0, uploading: 0 };
  }, []);

  return {
    // State
    uploads: state.uploads,
    isUploading: state.isUploading,
    dragActive: state.dragActive,
    error: state.error,
    
    // Actions
    uploadFiles,
    removeUpload,
    resetUploads,
    retryUpload,
    handleDrag,
    handleDrop,
    clearError,
    getUploadStats,
  };
}
