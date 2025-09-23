"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

import Button from "@/shared/ui/atoms/Button";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await signIn("cognito", { redirect: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="cursor-login-panel">
      <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto" }}>
        {/* Animation placeholder (you can mount your animation here) */}
        <div
          id="login-animation"
          style={{
            height: 200,
            marginBottom: 24,
          }}
        />

        <p
          style={{
            marginTop: 12,
            color: "var(--color-background)",
            fontSize: 18,
            fontWeight: 600,
            lineHeight: 1.5,
          }}
        >
          memory에 로그인하고, AI가 정리해주는 앨범을 시작하세요.
        </p>

        <div
          style={{
            marginTop: 28,
            display: "flex",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <Button
            onClick={handleLogin}
            disabled={loading}
            size="lg"
            style={{
              width: "100%",
              height: "56px",
              background: "#ffffff",
              color: "#111827",
              border: "1px solid #e5e7eb",
            }}
          >
            {loading ? "로그인 중..." : "Google로 계속하기"}
          </Button>
        </div>

        <p style={{ marginTop: 12, fontSize: 12, color: "#bdb7b1" }}>
          계속 진행하면 서비스 약관과 개인정보 처리방침에 동의하게 됩니다.
        </p>
      </div>
    </section>
  );
}
