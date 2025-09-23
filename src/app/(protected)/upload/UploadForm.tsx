"use client";

import React, { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { uploadImage } from "./actions";

/**
 * 이미지 업로드 폼 컴포넌트
 * Client Component로 상호작용 처리
 */
export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [isPending, startTransition] = useTransition();
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message?: string;
    image?: {
      id: string;
      url: string;
      title?: string;
      description?: string;
      createdAt: string;
    };
    error?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { data: session } = useSession();

  // 세션 토큰 정보 로깅 (개발 환경)
  React.useEffect(() => {
    if (process.env.NODE_ENV === "development" && session) {
      console.log("Upload Form - Session info:", {
        hasSession: !!session,
        hasAccessToken: !!(session as { accessToken?: string })?.accessToken,
        accessTokenLength:
          (session as { accessToken?: string })?.accessToken?.length || 0,
        sessionKeys: Object.keys(session),
        user: session,
      });
    }
  }, [session]);

  // 파일 선택 처리
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      // 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // 드래그 앤 드롭 처리
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // 업로드 처리 (Server Action 사용)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("파일을 선택해주세요.");
      return;
    }

    setUploadResult(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("tags", tags);

      // Server Action 사용 (JWT 방식)
      const result = await uploadImage(formData);
      if (result.success) {
        setUploadResult(result);
        // 성공 시 폼 초기화
        setFile(null);
        setPreview(null);
        setTitle("");
        setDescription("");
        setTags("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // 3초 후 갤러리로 이동
        setTimeout(() => {
          router.push("/gallery");
        }, 3000);
      } else {
        setUploadResult({
          success: false,
          message: result.error || "업로드에 실패했습니다.",
          error: result.error,
        });
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 파일 업로드 영역 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이미지 파일
          </label>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              file
                ? "border-green-300 bg-green-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {preview ? (
              <div className="space-y-4">
                <div className="relative w-32 h-32 mx-auto">
                  <Image
                    src={preview}
                    alt="미리보기"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <p className="text-sm text-gray-600">
                  {file?.name} ({((file?.size || 0) / 1024 / 1024).toFixed(1)}{" "}
                  MB)
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setPreview(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  파일 제거
                </button>
              </div>
            ) : (
              <div>
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-600">
                  클릭하거나 파일을 드래그하여 업로드
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF (최대 10MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 제목 입력 */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            제목
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="이미지 제목을 입력하세요"
          />
        </div>

        {/* 설명 입력 */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            설명
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="이미지에 대한 설명을 입력하세요"
          />
        </div>

        {/* 태그 입력 */}
        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            태그 (쉼표로 구분)
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="태그1, 태그2, 태그3"
          />
        </div>

        {/* 업로드 상태 */}
        {isPending && (
          <div className="p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg">
            <p className="font-medium">업로드 중...</p>
            <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}

        {/* 업로드 결과 */}
        {uploadResult && (
          <div
            className={`p-4 rounded-lg ${
              uploadResult.success
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            <p className="font-medium">
              {uploadResult.message || uploadResult.error}
            </p>
            {uploadResult.success && (
              <p className="text-sm mt-1">3초 후 갤러리로 이동합니다...</p>
            )}
          </div>
        )}

        {/* 업로드 버튼 */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={!file || isPending}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? "업로드 중..." : "업로드"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/gallery")}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
