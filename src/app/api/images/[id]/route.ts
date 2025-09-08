import { NextRequest, NextResponse } from 'next/server';

// Mock 데이터 (위와 동일한 구조)
const mockImages = Array.from({ length: 50 }, (_, i) => ({
  id: `image-${i + 1}`,
  url: `https://picsum.photos/800/600?random=${i + 1}`,
  thumbnailUrl: `https://picsum.photos/200/150?random=${i + 1}`,
  title: `Sample Image ${i + 1}`,
  description: `This is a detailed description for image ${i + 1}. It contains more information about the image content, location, and context.`,
  tags: [`tag${(i % 5) + 1}`, `category${(i % 3) + 1}`, `style${(i % 4) + 1}`],
  createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString(),
  size: Math.floor(Math.random() * 5000000) + 1000000,
  width: 800,
  height: 600,
  format: 'jpg',
  aiAnalysis: {
    objects: [`object${(i % 4) + 1}`, `item${(i % 3) + 1}`, `feature${(i % 2) + 1}`],
    colors: [
      `#${Math.floor(Math.random()*16777215).toString(16)}`, 
      `#${Math.floor(Math.random()*16777215).toString(16)}`,
      `#${Math.floor(Math.random()*16777215).toString(16)}`
    ],
    mood: ['happy', 'calm', 'energetic', 'peaceful', 'mysterious'][i % 5],
    confidence: Math.random() * 0.3 + 0.7,
    scene: ['indoor', 'outdoor', 'nature', 'urban'][i % 4],
    people: Math.random() > 0.5 ? Math.floor(Math.random() * 5) + 1 : 0
  }
}));

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    console.log('🖼️ Single Image API called:', { id });
    
    // 이미지 찾기
    const image = mockImages.find(img => img.id === id);
    
    if (!image) {
      console.log('❌ Image not found:', id);
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }
    
    // 응답 지연 시뮬레이션
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
    }
    
    console.log('🖼️ Single Image API response:', { id, title: image.title });
    
    return NextResponse.json(image);
    
  } catch (error) {
    console.error('❌ Single Image API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await request.json();
    
    console.log('✏️ Update Image API called:', { id, updates });
    
    // 이미지 찾기
    const imageIndex = mockImages.findIndex(img => img.id === id);
    
    if (imageIndex === -1) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }
    
    // 업데이트
    const updatedImage = {
      ...mockImages[imageIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    mockImages[imageIndex] = updatedImage;
    
    console.log('✏️ Update Image API response:', { id, title: updatedImage.title });
    
    return NextResponse.json(updatedImage);
    
  } catch (error) {
    console.error('❌ Update Image API error:', error);
    return NextResponse.json(
      { error: 'Failed to update image' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    console.log('🗑️ Delete Image API called:', { id });
    
    // 이미지 찾기
    const imageIndex = mockImages.findIndex(img => img.id === id);
    
    if (imageIndex === -1) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }
    
    // 삭제
    const deletedImage = mockImages.splice(imageIndex, 1)[0];
    
    console.log('🗑️ Delete Image API response:', { id, title: deletedImage.title });
    
    return NextResponse.json({ message: 'Image deleted successfully' });
    
  } catch (error) {
    console.error('❌ Delete Image API error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
