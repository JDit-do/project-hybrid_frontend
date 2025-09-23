"use client";

import { useRef, useState } from "react";
import { uploadService } from "@/features/upload/api/uploadService";
import UploadListItem from "../_molecules/UploadListItem";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
}

export default function UploadModal({ open, onClose }: UploadModalProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [items, setItems] = useState<{ name: string; progress: number }[]>([]);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    // init list items
    setItems((prev) => [
      ...prev,
      ...files.map((f) => ({ name: f.name, progress: 0 })),
    ]);
    // upload sequentially to show progress clearly
    for (const file of files) {
      await uploadService.uploadImage(file, (p) => {
        setItems((prev) =>
          prev.map((it) =>
            it.name === file.name ? { ...it, progress: p.percentage } : it
          )
        );
      });
    }
  };

  if (!open) return null;

  return (
    <div className="cursor-modal-overlay" role="dialog" aria-modal="true">
      <div className="cursor-modal">
        <div className="cursor-modal-header">
          <div>이미지 업로드</div>
          <button className="cursor-modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="cursor-modal-hero" />
        <div className="cursor-modal-body">
          <div className="cursor-card-title" style={{ marginBottom: 8 }}>
            AI가 자동으로 태깅해 드려요
          </div>
          <div className="cursor-tags" style={{ marginBottom: 16 }}>
            <span className="cursor-tag">#people</span>
            <span className="cursor-tag">#travel</span>
            <span className="cursor-tag">#food</span>
          </div>

          <div
            className={`cursor-dropzone ${dragActive ? "is-active" : ""}`}
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);
              handleFiles(e.dataTransfer.files);
            }}
          >
            여기로 이미지를 드래그&드랍 하세요
            <br />
            또는
            <div style={{ marginTop: 8 }}>
              <button
                className="cursor-button"
                onClick={() => inputRef.current?.click()}
              >
                파일 선택
              </button>
            </div>
          </div>

          <div className="cursor-upload-list">
            {items.map((item) => (
              <UploadListItem
                key={item.name}
                name={item.name}
                progress={item.progress}
              />
            ))}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      </div>
    </div>
  );
}
