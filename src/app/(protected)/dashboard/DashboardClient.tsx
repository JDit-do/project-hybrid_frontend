"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useModalStore } from "@/stores/modalStore";

import GalleryGrid from "@/shared/ui/organisms/GalleryGrid";
import apolloClient from "@/lib/apollo-client";
import {
  GET_SORTED_IMAGES_FOR_USER,
  type GetSortedImagesForUserResponse,
  GET_IMAGE_BY_KEY,
  type GetImageByKeyResponse,
  GET_GALLERY_IMAGES,
  type GetGalleryImagesResponse,
  type SortedCategory,
} from "@/features/gallery/api/queries";

import "@/app/cursor/cursor.scss";
import style from "./index.module.scss";

type Item = {
  id: string;
  title: string;
  tags: string[];
  date: string;
  url: string;
  image?: React.ReactNode;
};

export default function DashboardClient({
  initialItems,
  userId,
}: {
  initialItems: Item[];
  userId?: string;
}) {
  const router = useRouter();
  const [sort, setSort] = useState<"recent" | "title">("recent");
  const [isLoading, setIsLoading] = useState(false);
  const [rawItems, setRawItems] = useState<Item[]>(initialItems);
  const [aiCategories, setAiCategories] = useState<SortedCategory[] | null>(
    null
  );
  const { openUpload, openDetail } = useModalStore();

  const items = useMemo(() => {
    const arr = [...rawItems];
    if (sort === "recent") {
      arr.sort((a, b) => b.date.localeCompare(a.date));
    } else {
      arr.sort((a, b) => a.title.localeCompare(b.title));
    }
    return arr.map(({ id, title, tags, url }) => ({
      id,
      title,
      tags,
      url,
    }));
  }, [sort, rawItems]);

  const handleAISort = useCallback(async () => {
    try {
      setIsLoading(true);
      const effectiveUserId = userId!;
      const { data } = await apolloClient.query<GetSortedImagesForUserResponse>(
        {
          query: GET_SORTED_IMAGES_FOR_USER,
          variables: { UserID: effectiveUserId },
          fetchPolicy: "no-cache",
        }
      );

      const categories =
        data?.getSortedImagesForUser?.SortedData?.categories || [];
      setAiCategories(categories);
    } catch (err) {
      console.error("AI 정렬 실패:", err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const reloadOriginalList = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const { data } = await apolloClient.query<GetGalleryImagesResponse>({
        query: GET_GALLERY_IMAGES,
        variables: { albumId: userId },
        fetchPolicy: "no-cache",
      });
      const items = (data?.listMemoryImageMetadata?.items || []).map(
        (img, i) => ({
          id: img.OriginalKey || `image-${i}`,
          title: img.ImageSummary || "",
          tags: img.Tags || [],
          date: img.CreatedAt,
          url: img.OriginalPresignedUrl || img.ProcessedPresignedUrl || "",
        })
      );
      setRawItems(items);
    } catch (e) {
      console.error("원본 목록 재조회 실패:", e);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  return (
    <section className={style.wrap}>
      <div className={style.toolbar}>
        <div className={style.search}>
          <div className={style.sortGroup}>
            <span className={style.sortLabel}>정렬</span>
            <button
              className={`${style.sortButton} ${
                sort === "recent" ? style.sortButtonActive : ""
              } ${aiCategories ? style.sortButtonDisabled : ""}`}
              onClick={() => {
                if (!aiCategories) {
                  setSort("recent");
                }
              }}
              disabled={!!aiCategories}
            >
              최신순
            </button>
            <button
              className={`${style.sortButton} ${
                sort === "title" ? style.sortButtonActive : ""
              } ${aiCategories ? style.sortButtonDisabled : ""}`}
              onClick={() => {
                if (!aiCategories) {
                  setSort("title");
                }
              }}
              disabled={!!aiCategories}
            >
              제목순
            </button>
          </div>
          <div className={style.aiGroup}>
            {aiCategories ? (
              <button
                className={style.aiButtonSecondary}
                onClick={() => setAiCategories(null)}
                disabled={isLoading}
              >
                일반 조회
              </button>
            ) : (
              <button
                className={style.aiButtonPrimary}
                onClick={handleAISort}
                disabled={isLoading}
              >
                {isLoading ? "AI 조회 중..." : "AI 목록조회"}
              </button>
            )}
          </div>
        </div>

        <button className={style.uploadButton} onClick={() => openUpload()}>
          업로드
        </button>
      </div>

      {!aiCategories ? (
        <GalleryGrid
          items={items.map(({ id, title, tags, url }) => ({
            id,
            title,
            tags,
            url,
          }))}
          onItemClick={async (id) => {
            try {
              const detailTarget = items.find((x) => x.id === id);
              const originalKey = detailTarget?.id || id;
              const { data } = await apolloClient.query<GetImageByKeyResponse>({
                query: GET_IMAGE_BY_KEY,
                variables: { OriginalKey: originalKey },
                fetchPolicy: "no-cache",
              });
              const d = data?.getImageByKey;
              openDetail({
                title:
                  (d?.ImageSummary || d?.ImageName || detailTarget?.title) ??
                  undefined,
                tags: d?.Tags || detailTarget?.tags,
                imageUrl: (d?.DisplayUrl || detailTarget?.url) ?? undefined,
              });
            } catch (err) {
              console.error("이미지 상세 조회 실패:", err);
              const it = items.find((x) => x.id === id);
              openDetail({
                title: it?.title,
                tags: it?.tags,
                imageUrl: it?.url,
              });
            }
          }}
        />
      ) : (
        <div className={`flex flex-col ${style.gridai}`} style={{ gap: 24 }}>
          {aiCategories.map((cat, catIdx) => {
            const mapped = (cat.images || []).map((img, i) => ({
              id: img.imageKey || `${catIdx}-${i}`,
              title: img.ImageSummary || img.ImageName || "",
              tags: img.Tags || [],
              date: img.FormattedCreatedAt || "",
              url: img.presignedUrl || img.ThumbnailUrl || "",
            }));
            return (
              <section
                key={`${cat.categoryName}-${catIdx}`}
                className={style.category}
              >
                <div className={style.title}>
                  <h3 className="text-lg font-semibold">{cat.categoryName}</h3>
                  {cat.description ? (
                    <p className="text-sm" style={{ opacity: 0.8 }}>
                      {cat.description}
                    </p>
                  ) : null}
                </div>
                <div className={style.gallery}>
                  <GalleryGrid
                    items={mapped.map(({ id, title, tags, url }) => ({
                      id,
                      title,
                      tags,
                      url,
                    }))}
                    onItemClick={async (id) => {
                      try {
                        const detailTarget = mapped.find((x) => x.id === id);
                        const originalKey = detailTarget?.id || id;
                        const { data } = await apolloClient.query<GetImageByKeyResponse>({
                          query: GET_IMAGE_BY_KEY,
                          variables: { OriginalKey: originalKey },
                          fetchPolicy: "no-cache",
                        });
                        const d = data?.getImageByKey;
                        openDetail({
                          title:
                            (d?.ImageSummary || d?.ImageName || detailTarget?.title) ??
                            undefined,
                          tags: d?.Tags || detailTarget?.tags,
                          imageUrl: (d?.DisplayUrl || detailTarget?.url) ?? undefined,
                        });
                      } catch (err) {
                        console.error("이미지 상세 조회 실패:", err);
                        const it = mapped.find((x) => x.id === id);
                        openDetail({
                          title: it?.title,
                          tags: it?.tags,
                          imageUrl: it?.url,
                        });
                      }
                    }}
                  />
                </div>
              </section>
            );
          })}
        </div>
      )}
    </section>
  );
}
