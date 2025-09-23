"use client";

import { useRef, useState } from "react";

import DropzoneUpload from "@/shared/ui/molecules/DropzoneUpload";
import ModalHeader from "@/shared/ui/molecules/ModalHeader";

import style from "./index.module.scss";
import Image from "next/image";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onUploaded?: () => void;
}

export default function UploadModal({
  open,
  onClose,
  onUploaded,
}: UploadModalProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [items, setItems] = useState<
    { id: string; name: string; progress: number; previewUrl?: string }[]
  >([]);
  const [selectedFiles, setSelectedFiles] = useState<
    { id: string; file: File; previewUrl?: string }[]
  >([]);
  const [msg, setMsg] = useState<string>("");
  const [uploadStarted, setUploadStarted] = useState(false);
  const [uploadCompleted, setUploadCompleted] = useState(false);
  const isUploading = uploadStarted && !uploadCompleted;

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
    const all = Array.from(fileList).filter((f) => allowed.has(f.type));
    const remaining = Math.max(0, 70 - items.length);
    if (remaining === 0) return;
    const files = all.slice(0, remaining);

    // 초기 아이템 등록 (고유 id 생성)
    const fileEntries = files.map((f) => ({
      id: `${Date.now()}-${f.name}-${Math.random().toString(36).slice(2, 7)}`,
      file: f,
      previewUrl: URL.createObjectURL(f),
    }));
    setItems((prev) => [
      ...prev,
      ...fileEntries.map((e) => ({
        id: e.id,
        name: e.file.name,
        progress: 0,
        previewUrl: e.previewUrl,
      })),
    ]);
    setSelectedFiles((prev) => [
      ...prev,
      ...fileEntries.map((e) => ({
        id: e.id,
        file: e.file,
        previewUrl: e.previewUrl,
      })),
    ]);

    // 같은 파일 다시 선택 가능하도록 value 초기화
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemove = (id: string) => {
    const removed = items.find((it) => it.id === id);
    if (removed?.previewUrl) {
      try {
        URL.revokeObjectURL(removed.previewUrl);
      } catch {}
    }
    setItems((prev) => prev.filter((it) => it.id !== id));
    setSelectedFiles((prev) => prev.filter((it) => it.id !== id));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setMsg("오류: 업로드할 파일이 없습니다.");
      return;
    }
    setUploadStarted(true);
    setUploadCompleted(false);
    setMsg(`상태: ${selectedFiles.length}개 파일 업로드 시작...`);

    let completedCount = 0;
    for (const { id, file } of selectedFiles) {
      try {
        // 1. 프리사인 URL 요청
        const presignResponse = await fetch("/api/presign", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
          }),
        });

        if (!presignResponse.ok) {
          throw new Error(`프리사인 URL 요청 실패: ${presignResponse.status}`);
        }

        const presignData = await presignResponse.json();
        if (!presignData.success) {
          throw new Error(presignData.message || "프리사인 URL 요청 실패");
        }

        const { uploadUrl, key: _key } = presignData.data;

        // 2. S3에 직접 업로드
        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error(`S3 업로드 실패: ${uploadResponse.status}`);
        }

        // 3. 업로드 완료 처리
        setItems((prev) =>
          prev.map((it) => (it.id === id ? { ...it, progress: 100 } : it))
        );
        completedCount += 1;
        setMsg(
          `상태: ${completedCount}/${selectedFiles.length}개 파일 업로드 완료`
        );
      } catch (error) {
        console.error("업로드 에러:", error);
        setItems((prev) =>
          prev.map((it) => (it.id === id ? { ...it, progress: 0 } : it))
        );
        setMsg(
          `상태: 업로드 실패 - ${
            error instanceof Error ? error.message : "알 수 없는 오류"
          }`
        );
      }
    }

    if (completedCount === selectedFiles.length) {
      setUploadCompleted(true);
      setMsg("상태: 완료");
      try {
        // 업로드 완료 알림 (선택)
        onUploaded?.();
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("images:uploaded", {
              detail: { count: selectedFiles.length },
            })
          );
        }
      } catch {}
      // 잠시 보여주고 초기화
      setTimeout(() => {
        setItems([]);
        setSelectedFiles([]);
        setUploadStarted(false);
        setUploadCompleted(false);
        setMsg("");
        // close modal
        onClose();
      }, 1200);
    } else {
      setMsg(`상태: ${completedCount}/${selectedFiles.length} 완료`);
    }
  };

  if (!open) return null;

  return (
    <div className={style.wrap} role="dialog" aria-modal="true">
      <div className={style.modal}>
        {/* Header */}
        <ModalHeader onClose={isUploading ? () => {} : onClose} rounded />

        {/* Process */}
        <div
          style={{
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          {(() => {
            const total = selectedFiles.length;
            const avg =
              total > 0
                ? Math.round(
                    items
                      .filter((i) => selectedFiles.some((s) => s.id === i.id))
                      .reduce((acc, it) => acc + (it.progress || 0), 0) / total
                  )
                : 0;
            const done = items.filter(
              (i) =>
                (i.progress || 0) >= 100 &&
                selectedFiles.some((s) => s.id === i.id)
            ).length;
            return (
              <>
                <div style={{ fontSize: 12, color: "#bfbfbf", minWidth: 72 }}>
                  {done} / {total}
                </div>
                <div
                  style={{
                    flex: 1,
                    height: 6,
                    background: "rgba(255,255,255,0.15)",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${avg}%`,
                      height: "100%",
                      background:
                        "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
                    }}
                  />
                </div>
              </>
            );
          })()}
        </div>

        {/* 미리보기 */}
        <div
          className={style["cursor-modal-hero"]}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            padding: "16px 24px",
            overflowY: "auto",
            minHeight: 200,
            maxHeight: 300,
          }}
        >
          {items.map((it) => (
            <div
              key={it.id}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                // aspectRatio: "1",
                minHeight: 0,
                overflow: "hidden",
              }}
            >
              {it.previewUrl ? (
                <div
                  style={{
                    position: "relative",
                    borderRadius: 8,
                    overflow: "hidden",
                    background: "#1f1f1f",
                    // height: "100%",
                    maxHeight: "80px",
                    width: "100%",
                  }}
                >
                  <Image
                    src={it.previewUrl}
                    alt={it.name}
                    width={160}
                    height={160}
                    style={{
                      objectFit: "cover",
                    }}
                  />
                  {!isUploading && (
                    <button
                      type="button"
                      onClick={() => handleRemove(it.id)}
                      aria-label="삭제"
                      title="삭제"
                      style={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        width: 24,
                        height: 24,
                        borderRadius: 9999,
                        background: "rgba(0,0,0,0.5)",
                        color: "#fff",
                        border: "1px solid rgba(255,255,255,0.3)",
                        lineHeight: 1,
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    borderRadius: 8,
                    background: "#1f1f1f",
                    height: "100%",
                    width: "100%",
                  }}
                />
              )}
              <div
                title={it.name}
                style={{
                  fontSize: 11,
                  color: "#ddd",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  lineHeight: 1.2,
                  maxWidth: "100%",
                }}
              >
                {it.name}
              </div>
            </div>
          ))}
        </div>

        {/* body */}
        <div className={style["cursor-modal-body"]}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <div className="cursor-card-title">AI가 자동으로 태깅해 드려요</div>
            <button
              type="button"
              className="cursor-button"
              onClick={handleUpload}
              disabled={isUploading || selectedFiles.length === 0}
              style={{
                opacity: isUploading || selectedFiles.length === 0 ? 0.6 : 1,
                pointerEvents:
                  isUploading || selectedFiles.length === 0 ? "none" : "auto",
              }}
              aria-label="올리기"
              title="올리기"
            >
              올리기
            </button>
          </div>
          <div className="cursor-tags" style={{ marginBottom: 16 }}>
            <span className="cursor-tag">#people</span>
            <span className="cursor-tag">#travel</span>
            <span className="cursor-tag">#food</span>
          </div>

          <div
            style={{
              pointerEvents: isUploading ? "none" : "auto",
              opacity: isUploading ? 0.6 : 1,
            }}
          >
            <DropzoneUpload
              onFiles={(files) => handleFiles(files)}
              accept="image/jpeg,image/png,image/webp"
            />
          </div>

          {/* 파일 목록 대신 프리뷰 아래 파일명을 표시하므로 리스트는 제거 */}

          {msg && (
            <div style={{ marginTop: 12, fontSize: 12, opacity: 0.8 }}>
              {msg}
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            style={{ display: "none" }}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      </div>
    </div>
  );
}
