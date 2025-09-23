"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useUpload } from "../model/useUpload";

export default function UploadTestForm() {
  const { status } = useSession();
  const [files, setFiles] = useState<FileList | null>(null);
  const [msg, setMsg] = useState("대기 중");

  const { uploadFiles, isUploading, error } = useUpload({
    onSuccess: (successFiles) => {
      setMsg(`성공: ${successFiles.length}개 파일 업로드 완료!`);
      alert(`모든 파일(${successFiles.length}개) 업로드 성공!`);
    },
    onError: (error) => {
      setMsg(`오류: ${error.message}`);
      console.error("업로드 실패:", error);
    },
  });

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      setMsg("오류: 업로드할 파일이 없습니다.");
      return;
    }

    setMsg(`상태: ${files.length}개 파일 업로드 시작...`);
    await uploadFiles(Array.from(files));
  };

  const handleAppSync = async () => {
    // UI 테스트를 위해 API 호출 주석 처리
    console.log("AppSync Test - UI 테스트용 Mock 응답");
    alert("AppSync Test - UI 테스트용 Mock 응답 (API 비활성화됨)");
    
    /*
    try {
      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `query GetUserImagesContainingAlbumId {
                listMemoryImageMetadata(filter: {
                  AlbumID: {
                    contains: "d4d8dd2c-f081-7044-370e-4e9caffcc153" 
                  }
                }) {
                  items {
                    AlbumID # 이미지 s3 경로 중 파일명 제외된거 (제거 가능여부 확인중)
                    CreatedAt # 업로드된 시간
                    ImageSummary # 이미지 요약본
                    OriginalKey # 이미지 s3 경로(나중에 이미지 파일명으로 변경 가능)
                    Tags #이미지 태그들
                    OriginalPresignedUrl  #원본 이미지 링크(avif 파일이 없을때 사용)
                    ProcessedPresignedUrl #압축된 이미지 링크 (있으면 사용하기)

                  }
                  nextToken
                }
              }`,
        }),
      });
      const data = await response.json();

      console.log("AppSync :", JSON.stringify(data, null, 2));
      alert("AppSync Test 완료");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("AppSync 실패:", error);
        alert("AppSync Test 오류");
      } else {
        console.error("AppSync 실패(알 수 없는 에러):", error);
        alert("오류: unknown error");
      }
    }
    */
  };

  if (status !== "authenticated") {
    return <p>인증이 필요합니다.</p>;
  }

  return (
    <div className="upload-test-form">
      <h1>Gateway 업로드 테스트(Presign 포함)</h1>

      <div className="upload-section">
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setFiles(e.target.files ?? null)}
          multiple
          className="file-input"
        />

        <button
          onClick={handleUpload}
          disabled={!files || files.length === 0 || isUploading}
          className="upload-button"
        >
          {isUploading
            ? "업로드 중..."
            : `업로드 (${files ? files.length : 0}개 파일)`}
        </button>
      </div>

      <div className="status-section">
        <p className="status-message">{msg}</p>
        {error && <p className="error-message">오류: {error.message}</p>}
      </div>

      <div className="appsync-section">
        <p>AppSync 테스트</p>
        <button onClick={handleAppSync} className="appsync-button">
          AppSync 테스트 실행
        </button>
      </div>
    </div>
  );
}
