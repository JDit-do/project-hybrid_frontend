'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Brain, Search, Smartphone } from 'lucide-react';

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleDashboardClick = () => {
    router.push('/dashboard');
  };

  if (status === 'loading') {
    return (
      <div className="loading-page">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="onboarding-page">
      {/* Header */}
      <header className="page-header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">P</div>
            <div className="logo-text">
              <h1>Prism Memory</h1>
              <p>AI가 분석하는 스마트 앨범 서비스</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="page-main">
        <div className="hero">
          <h2>당신의 추억을 더욱 특별하게</h2>
          <p>
            AI가 자동으로 분석하고 태깅하여, 언제든지 쉽게 찾을 수 있는
            스마트한 앨범 서비스를 경험해보세요.
          </p>
        </div>

        {/* Features */}
        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">
              <Brain />
            </div>
            <h3>AI 분석</h3>
            <p>객체, 색상, 감정을 자동으로 분석하여 스마트 태깅</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Search />
            </div>
            <h3>스마트 검색</h3>
            <p>자연어로 검색하고 원하는 순간을 빠르게 찾기</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Smartphone />
            </div>
            <h3>반응형 디자인</h3>
            <p>모든 기기에서 완벽한 사용자 경험</p>
          </div>
        </div>

        {/* CTA */}
        <div className="cta">
          {!session ? (
            <button className="cta-button" onClick={handleLoginClick}>
              시작하기
            </button>
          ) : (
            <button className="cta-button" onClick={handleDashboardClick}>
              대시보드로 이동
            </button>
          )}
        </div>

        {/* Footer */}
        <footer className="page-footer">
          <p>하이브리드 기반 인프라와 DevOps로 구축된 AI 앨범 서비스</p>
        </footer>
      </main>
    </div>
  );
}