export interface Image {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  description?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  fileSize: number;
  width: number;
  height: number;
  format: 'jpg' | 'png' | 'webp' | 'gif';
}

export interface ImageUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  imageId?: string;
}

export interface ImageFilters {
  search?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  sortBy: 'newest' | 'oldest' | 'title' | 'size';
}

export interface ImagePagination {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}
