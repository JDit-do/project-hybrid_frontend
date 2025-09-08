"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, User, Mail, Home } from "lucide-react";

export default function LoginForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("cognito", {
        callbackUrl: "/dashboard-redirect",
        redirect: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDashboardClick = () => {
    router.push("/dashboard");
  };

  if (status === "loading") {
    return (
      <div className="loading-page">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (session && session.user) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <div className="success-icon">
                <User />
              </div>
              <h2>로그인 완료</h2>
              <p>Prism Memory에 성공적으로 로그인했습니다</p>
            </div>
            
            <div className="login-content">
              <div className="user-info">
                <Mail />
                <span>{session.user.email}</span>
              </div>

              <div className="button-group">
                <button className="btn-primary" onClick={handleDashboardClick}>
                  <Home />
                  대시보드로 이동
                </button>
                <button className="btn-secondary" onClick={handleSignOut} disabled={isLoading}>
                  <LogOut />
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-icon">P</div>
            <h1>Prism Memory</h1>
            <p>AI가 분석하는 스마트 앨범 서비스</p>
          </div>
          
          <div className="login-content">
            <button className="btn-google" onClick={handleSignIn} disabled={isLoading}>
              <svg className="google-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isLoading ? '로그인 중...' : 'Google로 계속하기'}
            </button>

            <p className="login-terms">
              로그인하면 서비스 이용약관 및 개인정보처리방침에 동의하는 것으로 간주됩니다.
            </p>

            <div className="features-preview">
              <div className="feature-item">
                <span>🤖</span>
                <span>AI 분석</span>
              </div>
              <div className="feature-item">
                <span>☁️</span>
                <span>클라우드</span>
              </div>
              <div className="feature-item">
                <span>🔒</span>
                <span>보안</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}