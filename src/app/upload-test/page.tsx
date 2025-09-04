"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function UploadTestPage() {
  const { status } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("대기 중");

  const handleUpload = async () => {
    try {
      // 1) Presigned URL 요청
      setMsg("상태: Presigned URL 요청 중...");
      const apiResponse = await fetch("/api/presign", {
        method: "POST",
        headers: {
          // 임시 테스트로 id_token 사용 => access_token으로 변경 예정
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileName: file?.name }),
      });
      if (!apiResponse.ok) {
        const txt = await apiResponse.text();
        throw new Error(`API Gateway 오류: ${apiResponse.status} ${txt}`);
      }
      const { uploadUrl } = await apiResponse.json();
      setMsg("상태: Presigned URL 수신 완료. 파일 업로드 중...");

      // 2) S3 업로드
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });
      if (!uploadResponse.ok) {
        const txt = await uploadResponse.text();
        throw new Error(`S3 업로드 오류: ${uploadResponse.status} ${txt}`);
      }
      setMsg(`성공: 파일 '${file?.name}' 업로드 완료!`);
      alert("파일 업로드 성공!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("업로드 실패:", error);
        setMsg(`오류: ${error.message}`);
      } else {
        console.error("업로드 실패(알 수 없는 에러):", error);
        setMsg("오류: unknown error");
      }
    }
  };

  const handleAppSync = async () => {
    try {
      const response = await fetch("/api/appsync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `GraphQL 쿼리문`,
        }),
      });
      const data = await response.json();

      console.log("AppSync :", JSON.stringify(data, null, 2));
      alert("AppSync Test 완료");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("업로드 실패:", error);
        alert("AppSync Test 오류");
      } else {
        console.error("업로드 실패(알 수 없는 에러):", error);
        alert("오류: unknown error");
      }
    }
  };

  return (
    <main>
      <h1>Gateway 업로드 테스트(Presign 포함)</h1>

      {status !== "authenticated" ? (
        <p>인증 X</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            style={{ marginBottom: "10px" }}
          />

          <button
            onClick={handleUpload}
            disabled={!file}
            style={{
              backgroundColor: file ? "black" : "gray",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: file ? "pointer" : "not-allowed",
            }}
          >
            업로드
          </button>
        </div>
      )}

      <p style={{ marginTop: "20px", fontSize: "14px", color: "gray" }}>
        {msg}
      </p>

      <div>
        <p>AppSync 테스트 중입니다!!!!!!</p>
        <div>
          <button onClick={handleAppSync} style={{ border: "1px solid red" }}>
            AppSync 가자!!! 집에... ㅋㅋ;;
          </button>
        </div>
      </div>
    </main>
  );
}
