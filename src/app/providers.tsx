'use client';

import { SessionProvider } from 'next-auth/react';
import { GalleryProvider, UploadProvider } from '@/contexts';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <GalleryProvider>
        <UploadProvider>
          {children}
        </UploadProvider>
      </GalleryProvider>
    </SessionProvider>
  );
}