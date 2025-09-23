"use client";

import Image from "next/image";

import Tag from "@/shared/ui/atoms/Tag";

import style from "./index.module.scss";

export interface DetailModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  tags?: string[];
  imageUrl?: string;
  imageAlt?: string;
  id?: string;
}

export default function DetailModal({
  open,
  onClose,
  title = "제목입니다.",
  tags = ["#태그", "#여행", "#인물"],
  imageUrl,
  imageAlt,
  id,
}: DetailModalProps) {
  if (!open) return null;

  return (
    <div className={style.wrap} role="dialog" aria-modal="true">
      <div
        className={style.modal} //  cursor-detail-modal
        style={{ width: "min(600px, calc(100% - 48px))" }}
      >
        <header>
          <button
            className={style.close} //" cursor-modal-close--round"
            onClick={onClose}
            aria-label="닫기"
          >
            ×
          </button>
        </header>

        {/* Image */}
        <main>
          <div
            className={style.hero}
            // className="cursor-modal-hero"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={imageAlt || title}
                width={600}
                height={600}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            )}
          </div>
        </main>

        {/* Info on bottom */}
        <div className="cursor-modal-body">
          <div className="cursor-card-title" style={{ marginBottom: 20 }}>
            {title}
          </div>

          {tags?.length ? (
            <div>
              <div className="cursor-detail-meta" style={{ marginBottom: 6 }}>
                태그
              </div>
              <div className="cursor-tags" style={{ marginTop: 4 }}>
                {tags.map((t) => (
                  <Tag key={t} variant="inverted">
                    #{t}
                  </Tag>
                ))}
              </div>
            </div>
          ) : null}

          {id && (
            <div style={{ marginTop: 16 }}>
              <div className="cursor-detail-meta" style={{ marginBottom: 6 }}>
                이미지 정보
              </div>
              <div style={{ display: "grid", gap: 6, fontSize: 12 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <span style={{ color: "#bfbfbf" }}>파일 ID</span>
                  <span
                    style={{
                      fontFamily:
                        "ui-monospace, SFMono-Regular, Menlo, monospace",
                    }}
                  >
                    {id}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Footer cancel button styled like upload modal close */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 16,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
