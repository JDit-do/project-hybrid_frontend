'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import Modal from '@/components/ui/modal';
import Button from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

export default function ImageUploadModal({ isOpen, onClose, onUploadSuccess }: ImageUploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    const newUploads: UploadProgress[] = imageFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading'
    }));

    setUploads(prev => [...prev, ...newUploads]);
    uploadFiles(newUploads);
  };

  const uploadFiles = async (filesToUpload: UploadProgress[]) => {
    setIsUploading(true);

    for (const upload of filesToUpload) {
      try {
        // Get presigned URL
        const presignResponse = await fetch('/api/presign', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filename: upload.file.name,
            contentType: upload.file.type,
          }),
        });

        if (!presignResponse.ok) {
          throw new Error('Failed to get presigned URL');
        }

        const { uploadUrl, key } = await presignResponse.json();

        // Upload to S3
        const uploadResponse = await fetch(uploadUrl, {
          method: 'PUT',
          body: upload.file,
          headers: {
            'Content-Type': upload.file.type,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload file');
        }

        // Update progress
        setUploads(prev => prev.map(u => 
          u.file === upload.file 
            ? { ...u, progress: 100, status: 'success' as const }
            : u
        ));

      } catch (error) {
        console.error('Upload error:', error);
        setUploads(prev => prev.map(u => 
          u.file === upload.file 
            ? { ...u, status: 'error' as const, error: error instanceof Error ? error.message : 'Upload failed' }
            : u
        ));
      }
    }

    setIsUploading(false);
    
    // Check if all uploads are complete
    setTimeout(() => {
      const allComplete = uploads.every(u => u.status === 'success' || u.status === 'error');
      if (allComplete) {
        onUploadSuccess();
      }
    }, 1000);
  };

  const removeUpload = (file: File) => {
    setUploads(prev => prev.filter(u => u.file !== file));
  };

  const resetModal = () => {
    setUploads([]);
    setIsUploading(false);
    setDragActive(false);
  };

  const handleClose = () => {
    if (!isUploading) {
      resetModal();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">이미지 업로드</h2>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {uploads.length === 0 ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">이미지를 드래그하거나 클릭하여 업로드</h3>
            <p className="text-gray-500 mb-4">
              JPG, PNG, WebP 형식을 지원합니다
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
            >
              파일 선택
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">업로드 진행 상황</h3>
              <span className="text-sm text-gray-500">
                {uploads.filter(u => u.status === 'success').length} / {uploads.length} 완료
              </span>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {uploads.map((upload, index) => (
                <motion.div
                  key={`${upload.file.name}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-3 p-3 border rounded-lg"
                >
                  <ImageIcon className="h-8 w-8 text-gray-400 flex-shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{upload.file.name}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          upload.status === 'success' 
                            ? 'bg-green-500' 
                            : upload.status === 'error'
                            ? 'bg-red-500'
                            : 'bg-blue-500'
                        }`}
                        style={{ width: `${upload.progress}%` }}
                      />
                    </div>
                    {upload.status === 'error' && upload.error && (
                      <p className="text-xs text-red-500 mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {upload.error}
                      </p>
                    )}
                  </div>

                  {upload.status === 'success' && (
                    <button
                      onClick={() => removeUpload(upload.file)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <X className="h-4 w-4 text-gray-400" />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>

            {uploads.every(u => u.status === 'success' || u.status === 'error') && (
              <div className="flex justify-end space-x-3">
                <Button
                  onClick={resetModal}
                  variant="outline"
                >
                  새로 업로드
                </Button>
                <Button
                  onClick={handleClose}
                  variant="primary"
                >
                  완료
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
