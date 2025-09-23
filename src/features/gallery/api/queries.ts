import { gql } from "@apollo/client";

export const GET_GALLERY_IMAGES = gql`
  query GetUserImagesContainingAlbumId($albumId: String!) {
    listMemoryImageMetadata(filter: { AlbumID: { contains: $albumId } }) {
      items {
        AlbumID
        CreatedAt
        ImageSummary
        OriginalKey
        Tags
        OriginalPresignedUrl
        ProcessedPresignedUrl
      }
      nextToken
    }
  }
`;

export interface GalleryImageItem {
  AlbumID: string;
  CreatedAt: string;
  ImageSummary?: string | null;
  OriginalKey: string;
  Tags?: string[] | null;
  OriginalPresignedUrl?: string | null;
  ProcessedPresignedUrl?: string | null;
}

export interface GetGalleryImagesResponse {
  listMemoryImageMetadata: {
    items: GalleryImageItem[];
    nextToken?: string | null;
  };
}

// AI 정렬 이미지 조회: 특정 사용자에 대해 카테고리별로 정렬된 이미지 반환
export const GET_SORTED_IMAGES_FOR_USER = gql`
  query GetSortedImagesForSpecificUser($UserID: ID!) {
    getSortedImagesForUser(UserID: $UserID) {
      UserID
      SortedData {
        categories {
          categoryName
          description
          images {
            imageKey
            presignedUrl
            ImageName
            ThumbnailUrl
            FormattedCreatedAt
            ImageSummary
            Tags
          }
        }
      }
    }
  }
`;

export interface SortedImageItem {
  imageKey: string;
  presignedUrl: string;
  ImageName: string;
  ThumbnailUrl: string;
  FormattedCreatedAt: string;
  ImageSummary: string;
  Tags: string[];
  __typename: string;
}

export interface SortedCategory {
  categoryName: string;
  description?: string | null;
  images: SortedImageItem[];
}

export interface GetSortedImagesForUserResponse {
  getSortedImagesForUser: {
    UserID: string;
    SortedData: {
      categories: SortedCategory[];
    };
  };
}

// 단일 이미지 상세 조회
export const GET_IMAGE_BY_KEY = gql`
  query getSpecificImage($OriginalKey: String!) {
    getImageByKey(OriginalKey: $OriginalKey) {
      ImageName
      DisplayUrl
      ThumbnailUrl
      FormattedCreatedAt
      ImageSummary
      Tags
    }
  }
`;

export interface GetImageByKeyResponse {
  getImageByKey: {
    ImageName?: string | null;
    DisplayUrl?: string | null;
    ThumbnailUrl?: string | null;
    FormattedCreatedAt?: string | null;
    ImageSummary?: string | null;
    Tags?: string[] | null;
  };
}
