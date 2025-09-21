import { Metadata } from 'next';
import { requireAuth } from '@/shared/lib/auth/serverAuth';

export const metadata: Metadata = {
  title: '갤러리 - Prism Memory',
  description: '업로드된 이미지를 관리하고 탐색하세요',
};

export default async function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 서버사이드에서 세션 확인
  await requireAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
