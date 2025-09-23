"use client";

import { useRef, useState } from "react";
import Button from "@/shared/ui/atoms/Button";
import FileInput from "@/shared/ui/atoms/FileInput";

export default function DropzoneUpload({
  onFiles,
  accept = "image/*",
}: {
  onFiles: (files: FileList | null) => void;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);

  return (
    <div>
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
          onFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        <div className="cursor-dropzone__inner">
          <svg
            className="cursor-dropzone__icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16V4m0 0l-4 4m4-4l4 4"
            />
            <path
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2"
            />
          </svg>
          <div className="cursor-dropzone__title">
            여기로 이미지를 드래그 & 드랍 하세요
          </div>
          <div className="cursor-dropzone__subtitle">또는</div>
          <div className="cursor-dropzone__actions">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              파일 선택
            </Button>
          </div>
          <div className="cursor-dropzone__hint">
            JPG, PNG, WebP · 최대 70개
          </div>
        </div>
      </div>
      <FileInput ref={inputRef} onFiles={onFiles} accept={accept} />
    </div>
  );
}
