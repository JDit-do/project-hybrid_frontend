import { NextRequest, NextResponse } from 'next/server';

// Mock 데이터
const mockImages = Array.from({ length: 50 }, (_, i) => ({
  id: `image-${i + 1}`,
  url: `https://picsum.photos/400/300?random=${i + 1}`,
  thumbnailUrl: `https://picsum.photos/200/150?random=${i + 1}`,
  title: `Sample Image ${i + 1}`,
  description: `This is a sample image description for image ${i + 1}`,
  tags: [`tag${(i % 5) + 1}`, `category${(i % 3) + 1}`],
  createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString(),
  size: Math.floor(Math.random() * 5000000) + 1000000, // 1MB ~ 5MB
  width: 400,
  height: 300,
  format: 'jpg',
  aiAnalysis: {
    objects: [`object${(i % 4) + 1}`, `item${(i % 3) + 1}`],
    colors: [`#${Math.floor(Math.random()*16777215).toString(16)}`, `#${Math.floor(Math.random()*16777215).toString(16)}`],
    mood: ['happy', 'calm', 'energetic', 'peaceful'][i % 4],
    confidence: Math.random() * 0.3 + 0.7 // 0.7 ~ 1.0
  }
}));

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 파라미터 파싱
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const search = searchParams.get('search') || '';
    const tags = searchParams.get('tags')?.split(',') || [];
    
    console.log('📸 Images API called:', { page, limit, sortBy, search, tags });
    
    // 검색 필터링
    let filteredImages = mockImages;
    
    if (search) {
      filteredImages = filteredImages.filter(img => 
        img.title.toLowerCase().includes(search.toLowerCase()) ||
        img.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (tags.length > 0) {
      filteredImages = filteredImages.filter(img => 
        tags.some(tag => img.tags.includes(tag))
      );
    }
    
    // 정렬
    switch (sortBy) {
      case 'newest':
        filteredImages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filteredImages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'title':
        filteredImages.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'size':
        filteredImages.sort((a, b) => b.size - a.size);
        break;
    }
    
    // 페이지네이션
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedImages = filteredImages.slice(startIndex, endIndex);
    
    const total = filteredImages.length;
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;
    
    // 응답 지연 시뮬레이션 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    }
    
    const response = {
      images: paginatedImages,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore
      }
    };
    
    console.log('📸 Images API response:', { 
      returned: paginatedImages.length, 
      total, 
      page, 
      hasMore 
    });
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('❌ Images API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}
