export interface Album {
  id: string;
  title: string;
  description?: string;
  coverImageId?: string;
  imageIds: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  tags?: string[];
}

export interface AlbumWithImages extends Album {
  images: Array<{
    id: string;
    url: string;
    thumbnail: string;
    title: string;
  }>;
}

export interface AlbumFilters {
  search?: string;
  tags?: string[];
  isPublic?: boolean;
  sortBy: 'newest' | 'oldest' | 'title' | 'imageCount';
}
