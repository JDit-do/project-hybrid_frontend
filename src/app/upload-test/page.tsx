"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function UploadTestPage() {
  const { data: session, status } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("대기 중");

  const apiGatewayUrl = process.env.NEXT_PUBLIC_PRESIGN_API!;

  const handleUpload = async () => {
    try {
      // 1) Presigned URL 요청
      setMsg("상태: Presigned URL 요청 중...");
      const apiResponse = await fetch(apiGatewayUrl, {
        method: "POST",
        headers: {
          // 임시 테스트로 id_token 사용 => access_token으로 변경 예정
          Authorization: `${session?.id_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileName: file?.name! }),
      });
      if (!apiResponse.ok) {
        const txt = await apiResponse.text();
        throw new Error(`API Gateway 오류: ${apiResponse.status} ${txt}`);
      }
      const data = await apiResponse.json();
      const uploadUrl: string = data.uploadUrl;
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
    } catch (error: any) {
      console.error("업로드 실패:", error);
      setMsg(`오류: ${error?.message ?? "unknown error"}`);
    }
  };

  return (
    <main>
      <h1>Gateway 업로드 테스트(Presign 포함)</h1>

      {status !== "authenticated" ? (
        <p>인증 X</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
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
    </main>
  );
}
