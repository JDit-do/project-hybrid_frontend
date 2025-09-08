export interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
  id: string;
}

export interface UploadState {
  uploads: UploadProgress[];
  isUploading: boolean;
  dragActive: boolean;
  error: Error | null;
}

export interface UploadOptions {
  onSuccess?: (files: File[]) => void;
  onError?: (error: Error) => void;
  maxFileSize?: number; // bytes
  allowedTypes?: string[];
}

export class UploadService {
  private state: UploadState;
  private options: Required<UploadOptions>;
  private observers: ((state: UploadState) => void)[] = [];

  constructor(options: UploadOptions = {}) {
    this.options = {
      onSuccess: options.onSuccess || (() => {}),
      onError: options.onError || (() => {}),
      maxFileSize: options.maxFileSize || 10 * 1024 * 1024, // 10MB
      allowedTypes: options.allowedTypes || ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    };

    this.state = {
      uploads: [],
      isUploading: false,
      dragActive: false,
      error: null,
    };
  }

  // State management
  private setState(updates: Partial<UploadState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyObservers();
  }

  private notifyObservers(): void {
    this.observers.forEach(observer => observer(this.state));
  }

  // Observer pattern for React integration
  subscribe(observer: (state: UploadState) => void): () => void {
    this.observers.push(observer);
    return () => {
      const index = this.observers.indexOf(observer);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  // Get current state
  getState(): UploadState {
    return { ...this.state };
  }

  // Clear error
  clearError(): void {
    this.setState({ error: null });
  }

  // Validate files
  private validateFiles(files: File[]): File[] {
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach(file => {
      // Check file type
      if (!this.options.allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: 지원하지 않는 파일 형식입니다.`);
        return;
      }

      // Check file size
      if (file.size > this.options.maxFileSize) {
        errors.push(`${file.name}: 파일 크기가 너무 큽니다. (최대 ${this.options.maxFileSize / 1024 / 1024}MB)`);
        return;
      }

      validFiles.push(file);
    });

    if (validFiles.length === 0) {
      throw new Error('유효한 파일이 없습니다.\n' + errors.join('\n'));
    }

    if (errors.length > 0) {
      console.warn('파일 검증 경고:', errors);
    }

    return validFiles;
  }

  // Get presigned URL
  private async getPresignedUrl(file: File): Promise<{ uploadUrl: string; key: string }> {
    const response = await fetch('/api/presign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get presigned URL');
    }

    return response.json();
  }

  // Upload single file
  private async uploadSingleFile(upload: UploadProgress): Promise<boolean> {
    try {
      // Update progress to 10%
      this.updateUploadProgress(upload.id, 10);

      // Get presigned URL
      const { uploadUrl } = await this.getPresignedUrl(upload.file);

      // Update progress to 30%
      this.updateUploadProgress(upload.id, 30);

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

      // Update progress to 100% and mark as success
      this.updateUploadStatus(upload.id, 'success', 100);

      return true;
    } catch (error) {
      console.error('Upload error:', error);
      this.updateUploadStatus(
        upload.id, 
        'error', 
        upload.progress,
        error instanceof Error ? error.message : 'Upload failed'
      );
      return false;
    }
  }

  // Update upload progress
  private updateUploadProgress(id: string, progress: number): void {
    this.setState({
      uploads: this.state.uploads.map(upload =>
        upload.id === id ? { ...upload, progress } : upload
      )
    });
  }

  // Update upload status
  private updateUploadStatus(
    id: string, 
    status: UploadProgress['status'], 
    progress?: number,
    error?: string
  ): void {
    this.setState({
      uploads: this.state.uploads.map(upload =>
        upload.id === id 
          ? { ...upload, status, ...(progress !== undefined && { progress }), ...(error && { error }) }
          : upload
      )
    });
  }

  // Upload multiple files
  async uploadFiles(files: File[]): Promise<void> {
    try {
      const validFiles = this.validateFiles(files);
      
      const newUploads: UploadProgress[] = validFiles.map(file => ({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        progress: 0,
        status: 'uploading'
      }));

      this.setState({
        uploads: [...this.state.uploads, ...newUploads],
        isUploading: true,
        error: null
      });

      const results = await Promise.all(
        newUploads.map(upload => this.uploadSingleFile(upload))
      );

      const successCount = results.filter(Boolean).length;
      const successFiles = validFiles.filter((_, index) => results[index]);

      if (successCount > 0) {
        this.options.onSuccess?.(successFiles);
      }

      if (successCount < validFiles.length) {
        const error = new Error(`${validFiles.length - successCount}개 파일 업로드 실패`);
        this.setState({ error });
        this.options.onError?.(error);
      }
    } catch (error) {
      const uploadError = error instanceof Error ? error : new Error('Upload failed');
      this.setState({ error: uploadError });
      this.options.onError?.(uploadError);
    } finally {
      this.setState({ isUploading: false });
    }
  }

  // Remove upload
  removeUpload(id: string): void {
    this.setState({
      uploads: this.state.uploads.filter(upload => upload.id !== id)
    });
  }

  // Reset uploads
  resetUploads(): void {
    this.setState({
      uploads: [],
      isUploading: false,
      dragActive: false,
      error: null
    });
  }

  // Retry failed upload
  async retryUpload(id: string): Promise<void> {
    const upload = this.state.uploads.find(u => u.id === id);
    if (!upload || upload.status !== 'error') return;

    this.updateUploadStatus(id, 'uploading', 0);
    await this.uploadSingleFile(upload);
  }

  // Drag handlers
  handleDrag(e: React.DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      this.setState({ dragActive: true });
    } else if (e.type === 'dragleave') {
      this.setState({ dragActive: false });
    }
  }

  handleDrop(e: React.DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ dragActive: false });
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      this.uploadFiles(Array.from(e.dataTransfer.files));
    }
  }

  // Get upload statistics
  getUploadStats(): {
    total: number;
    success: number;
    error: number;
    uploading: number;
  } {
    const uploads = this.state.uploads;
    return {
      total: uploads.length,
      success: uploads.filter(u => u.status === 'success').length,
      error: uploads.filter(u => u.status === 'error').length,
      uploading: uploads.filter(u => u.status === 'uploading').length,
    };
  }

  // Cleanup
  destroy(): void {
    this.observers = [];
  }
}
