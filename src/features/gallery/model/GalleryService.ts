import { Image, ImageFilters, ImagePagination } from '@/entities/image/model/types';
import { getImages, getImage, updateImage, deleteImage } from '@/entities/image/api/imageApi';

export interface GalleryState {
  images: Image[];
  loading: boolean;
  hasMore: boolean;
  viewMode: 'grid' | 'list';
  selectedImage: Image | null;
  isInitialLoad: boolean;
  currentPage: number;
  error: Error | null;
  retryCount: number;
}

export interface GalleryOptions {
  pageSize?: number;
  maxRetries?: number;
}

export class GalleryService {
  private state: GalleryState;
  private options: Required<GalleryOptions>;
  private loadingTimeout: NodeJS.Timeout | null = null;
  private observers: ((state: GalleryState) => void)[] = [];

  constructor(options: GalleryOptions = {}) {
    this.options = {
      pageSize: options.pageSize || 12,
      maxRetries: options.maxRetries || 3,
    };

    this.state = {
      images: [],
      loading: false,
      hasMore: true,
      viewMode: 'grid',
      selectedImage: null,
      isInitialLoad: true,
      currentPage: 0,
      error: null,
      retryCount: 0,
    };
  }

  // State management
  private setState(updates: Partial<GalleryState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyObservers();
  }

  private notifyObservers(): void {
    this.observers.forEach(observer => observer(this.state));
  }

  // Observer pattern for React integration
  subscribe(observer: (state: GalleryState) => void): () => void {
    this.observers.push(observer);
    // Return unsubscribe function
    return () => {
      const index = this.observers.indexOf(observer);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  // Get current state
  getState(): GalleryState {
    return { ...this.state };
  }

  // Clear error
  clearError(): void {
    this.setState({ error: null, retryCount: 0 });
  }

  // Set loading timeout
  private setLoadingTimeout(): void {
    this.clearLoadingTimeout();
    this.loadingTimeout = setTimeout(() => {
      if (this.state.loading) {
        this.handleError(new Error('요청 시간이 초과되었습니다.'));
      }
    }, 10000);
  }

  private clearLoadingTimeout(): void {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
      this.loadingTimeout = null;
    }
  }

  // Error handling
  private handleError(error: Error): void {
    console.error('Gallery error:', error);
    this.setState({ 
      error, 
      loading: false,
      retryCount: this.state.retryCount + 1 
    });
    this.clearLoadingTimeout();
  }

  // Retry logic
  async retry(): Promise<void> {
    if (this.state.retryCount < this.options.maxRetries) {
      console.log(`Retrying gallery load (${this.state.retryCount}/${this.options.maxRetries})`);
      await this.loadImages(true);
    }
  }

  canRetry(): boolean {
    return this.state.retryCount < this.options.maxRetries;
  }

  // Load images
  async loadImages(reset = false): Promise<void> {
    if (this.state.loading) return;

    this.setState({ loading: true });
    this.clearError();
    this.setLoadingTimeout();

    try {
      const page = reset ? 0 : this.state.currentPage;
      const result = await getImages(
        { sortBy: 'newest' }, 
        { page, limit: this.options.pageSize }
      );

      this.clearLoadingTimeout();

      if (reset) {
        this.setState({
          images: result.images,
          currentPage: 0,
          isInitialLoad: false,
        });
      } else {
        this.setState({
          images: [...this.state.images, ...result.images],
        });
      }

      this.setState({
        hasMore: result.pagination.hasMore,
        currentPage: page + 1,
        loading: false,
      });

    } catch (error) {
      this.handleError(error as Error);
    }
  }

  // Load more images (for infinite scroll)
  async loadMore(): Promise<void> {
    if (!this.state.loading && this.state.hasMore) {
      await this.loadImages(false);
    }
  }

  // Set filtered images (from search feature)
  setFilteredImages(filteredImages: Image[]): void {
    this.setState({ images: filteredImages });
  }

  // View mode
  changeViewMode(mode: 'grid' | 'list'): void {
    this.setState({ viewMode: mode });
  }

  // Image selection
  selectImage(image: Image | null): void {
    this.setState({ selectedImage: image });
  }

  // Delete image
  async deleteImage(imageId: string): Promise<void> {
    try {
      await deleteImage(imageId);
      const updatedImages = this.state.images.filter(img => img.id !== imageId);
      this.setState({ images: updatedImages });
      
      if (this.state.selectedImage?.id === imageId) {
        this.setState({ selectedImage: null });
      }
    } catch (error) {
      console.error('Failed to delete image:', error);
      this.handleError(error as Error);
    }
  }

  // Update image
  async updateImage(imageId: string, updates: Partial<Image>): Promise<void> {
    try {
      const updatedImage = await updateImage(imageId, updates);
      const updatedImages = this.state.images.map(img => 
        img.id === imageId ? updatedImage : img
      );
      this.setState({ images: updatedImages });
      
      if (this.state.selectedImage?.id === imageId) {
        this.setState({ selectedImage: updatedImage });
      }
    } catch (error) {
      console.error('Failed to update image:', error);
      this.handleError(error as Error);
    }
  }

  // Get single image
  async getImage(imageId: string): Promise<Image | null> {
    try {
      return await getImage(imageId);
    } catch (error) {
      console.error('Failed to get image:', error);
      this.handleError(error as Error);
      return null;
    }
  }

  // Cleanup
  destroy(): void {
    this.clearLoadingTimeout();
    this.observers = [];
  }
}
