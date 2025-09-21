"use client";

import { SessionProvider } from "next-auth/react";
import { ApolloProvider } from "@apollo/client/react";
import { GalleryProvider, UploadProvider } from "@/contexts";
import { apolloClient } from "@/lib/apollo-client";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ApolloProvider client={apolloClient}>
        <GalleryProvider>
          <UploadProvider>{children}</UploadProvider>
        </GalleryProvider>
      </ApolloProvider>
    </SessionProvider>
  );
}
