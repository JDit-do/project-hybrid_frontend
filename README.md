# Prism Memory - AI Powered Album Service

AI가 분석하는 스마트 앨범 서비스로 당신의 소중한 추억을 더욱 특별하게 만들어보세요.

## 🚀 빠른 시작

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build
```

## 🏗️ 기술 스택

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **상태 관리**: Zustand + Context API (하이브리드)
- **인증**: NextAuth.js + AWS Cognito
- **스타일링**: Tailwind CSS + CSS Modules
- **애니메이션**: Framer Motion
- **아이콘**: Lucide React

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
├── shared/                # 공유 리소스 (UI 컴포넌트, 유틸리티)
├── entities/              # 비즈니스 엔티티 (User, Image, Album)
├── features/              # 비즈니스 기능 (Auth, Gallery, Upload, Search)
├── widgets/               # 복합 위젯 (Upload Modal, Image Detail)
├── stores/                # Zustand 전역 상태
├── contexts/              # Context API 도메인 상태
└── hooks/                 # 통합 훅
```

## 🎯 주요 기능

- **AI 이미지 분석**: 객체, 색상, 감정 분석
- **스마트 갤러리**: 무한 스크롤, 검색, 필터링
- **드래그앤드롭 업로드**: 다중 파일 업로드
- **앨범 관리**: 자동 태깅, 분류
- **반응형 디자인**: 모바일/데스크톱 최적화

## 📚 상세 문서

프로젝트의 상세한 기술 문서는 [`docs/`](./docs/) 폴더를 참조하세요:

- **[아키텍처 가이드](./docs/ARCHITECTURE.md)** - 프로젝트 구조와 설계 원칙
- **[상태 관리](./docs/STATE_MANAGEMENT.md)** - Zustand + Context API 하이브리드 접근법

## 🛠️ 개발 환경

### 필수 요구사항
- Node.js 18+
- pnpm 8+

### 환경 변수 설정
`.env.local` 파일을 생성하고 다음 변수를 설정하세요:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# AWS Cognito Configuration
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your-user-pool-id
NEXT_PUBLIC_COGNITO_CLIENT_ID=your-client-id
NEXT_PUBLIC_COGNITO_REGION=your-region

# Presign API
NEXT_PUBLIC_PRESIGN_API=your-presign-api-url
```

## 🧪 테스트

```bash
# 단위 테스트
pnpm test

# E2E 테스트
pnpm test:e2e

# 테스트 커버리지
pnpm test:coverage
```

## 🚀 배포

```bash
# 프로덕션 빌드
pnpm build

# Vercel 배포
vercel --prod
```

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 질문이나 제안이 있으시면 GitHub Issues를 통해 문의해주세요.

---

**참고**: 상세한 기술 문서는 [`docs/`](./docs/) 폴더를 참조하세요.
