"use client";

import { useQuery } from "@apollo/client/react";
import { ApolloClient } from "@apollo/client";
import { HttpLink } from "@apollo/client/link/http";
import { SetContextLink } from "@apollo/client/link/context";

import { apolloClient } from "@/lib/apollo-client";

import {
  GET_GALLERY_IMAGES,
  type GetGalleryImagesResponse,
  type GalleryImageItem,
} from "../api/queries";

export interface UseGalleryImagesParams {
  albumId?: string | null;
  accessToken?: string | null;
}

export interface UseGalleryImagesResult {
  images: GalleryImageItem[];
  nextToken?: string | null;
  loading: boolean;
  error?: Error;
}

function createAuthClient(accessToken?: string | null) {
  if (!accessToken) return apolloClient;

  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!,
  });

  const authLink = new SetContextLink((prevContext) => ({
    headers: {
      ...prevContext?.headers,
      authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  }));

  return new ApolloClient({
    ...apolloClient,
    link: authLink.concat(httpLink),
  });
}

export function useGalleryImages({
  albumId,
  accessToken,
}: UseGalleryImagesParams): UseGalleryImagesResult {
  const client = createAuthClient(accessToken);

  const { data, loading, error } = useQuery<GetGalleryImagesResponse>(
    GET_GALLERY_IMAGES,
    {
      client,
      skip: !albumId,
      variables: { albumId: albumId as string },
      notifyOnNetworkStatusChange: true,
    }
  );

  return {
    images: data?.listMemoryImageMetadata?.items ?? [],
    nextToken: data?.listMemoryImageMetadata?.nextToken ?? null,
    loading,
    error: error as Error | undefined,
  };
}
