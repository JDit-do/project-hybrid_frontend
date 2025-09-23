// Mock 데이터 생성
const mockImages = Array.from({ length: 20 }, (_, i) => ({
  id: `img-${i + 1}`,
  title: `Sample Image ${i + 1}`,
  description: `This is a sample image ${i + 1}`,
  thumbnail: '/placeholder-image.jpg',
  fullImage: '/placeholder-image.jpg',
  tags: ['nature', 'landscape', 'sample'],
  createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
  fileSize: 1024 * (i + 1),
  width: 800 + i * 10,
  height: 600 + i * 10
}));

export const resolvers = {
  Query: {
    images: async (_: any, { limit = 10, offset = 0, sortBy = 'createdAt' }: any) => {
      console.log('GraphQL images query:', { limit, offset, sortBy });
      
      // 정렬 로직
      const sortedImages = [...mockImages];
      if (sortBy === 'createdAt') {
        sortedImages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else if (sortBy === 'title') {
        sortedImages.sort((a, b) => a.title.localeCompare(b.title));
      }
      
      // 페이지네이션
      const startIndex = offset;
      const endIndex = startIndex + limit;
      const paginatedImages = sortedImages.slice(startIndex, endIndex);
      
      return paginatedImages;
    },
    
    image: async (_: any, { id }: { id: string }) => {
      console.log('GraphQL image query:', { id });
      return mockImages.find(img => img.id === id) || null;
    },
    
    searchImages: async (_: any, { query, limit = 10, offset = 0 }: any) => {
      console.log('GraphQL searchImages query:', { query, limit, offset });
      
      const filteredImages = mockImages.filter(img => 
        img.title.toLowerCase().includes(query.toLowerCase()) ||
        img.description?.toLowerCase().includes(query.toLowerCase()) ||
        img.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      
      return filteredImages.slice(offset, offset + limit);
    },
    
    tags: async () => {
      console.log('GraphQL tags query');
      
      // 태그 카운트 계산
      const tagCounts: { [key: string]: number } = {};
      mockImages.forEach(img => {
        img.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });
      
      return Object.entries(tagCounts).map(([name, count], index) => ({
        id: `tag-${index}`,
        name,
        count
      }));
    }
  },
  
  Mutation: {
    uploadImage: async (_: any, { input }: any) => {
      console.log('GraphQL uploadImage mutation:', { input });
      
      // Mock 업로드 응답
      const newImage = {
        id: `img-${Date.now()}`,
        title: input.title,
        description: input.description || '',
        thumbnail: '/placeholder-thumbnail.jpg',
        fullImage: '/placeholder-full.jpg',
        tags: input.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fileSize: 1024000,
        width: 1920,
        height: 1080
      };
      
      mockImages.unshift(newImage);
      return newImage;
    }
  }
};
