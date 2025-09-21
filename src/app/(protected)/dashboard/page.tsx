import { getServerSession } from "next-auth";

import { HttpLink } from "@apollo/client/link/http";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import {
  GET_GALLERY_IMAGES,
  type GetGalleryImagesResponse,
  type GalleryImageItem,
} from "@/features/gallery/api/queries";

import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const client = new ApolloClient({
    ssrMode: true,
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!,
      headers: {
        // 인증 쪽에서 권한 관련 일괄 처리
        authorization: `Bearer ${session?.accessToken}`,
      },
      fetchOptions: { cache: "no-store" },
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: { errorPolicy: "all" },
      watchQuery: { errorPolicy: "all" },
    },
  });

  const albumId = (session as any)?.sub as string | undefined;

  let images: GalleryImageItem[] = [];
  if (session?.accessToken && albumId) {
    const { data } = await client.query<GetGalleryImagesResponse>({
      query: GET_GALLERY_IMAGES,
      variables: { albumId },
      fetchPolicy: "no-cache",
    });
    images = data?.listMemoryImageMetadata?.items ?? [];
  }

  const initialItems = images.map((img, i) => ({
    id: img.OriginalKey || `image-${i}`,
    title: img.ImageSummary || "",
    tags: img.Tags || [],
    date: img.CreatedAt,
    url: img.OriginalPresignedUrl || "",
    originalData: { ...img },
  }));

  return <DashboardClient initialItems={initialItems} userId={albumId} />;
}
