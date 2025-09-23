import { Metadata } from 'next';
import { requireAuth } from '@/shared/lib/auth/serverAuth';

export const metadata: Metadata = {
  title: '이미지 업로드 - Prism Memory',
  description: '이미지를 업로드하고 관리하세요',
};

export default async function UploadLayout({
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











