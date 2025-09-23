# 아키텍처 가이드

## 📋 개요

Prism Memory는 **Feature-Sliced Design (FSD) + Atomic Design** 하이브리드 아키텍처를 사용합니다.

## 🏗️ 폴더 구조

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── dashboard/         # 대시보드 페이지
│   ├── login/            # 로그인 페이지
│   ├── layout.tsx        # 루트 레이아웃
│   └── providers.tsx     # Provider 설정
├── shared/               # 공유 리소스
│   ├── lib/              # 유틸리티 함수
│   ├── styles/           # 스타일 시스템
│   └── ui/               # UI 컴포넌트 (Atomic Design)
│       ├── atoms/        # 기본 컴포넌트
│       ├── molecules/    # 복합 컴포넌트
│       └── organisms/    # 복잡한 컴포넌트
├── entities/             # 비즈니스 엔티티
│   ├── user/            # 사용자 엔티티
│   ├── image/           # 이미지 엔티티
│   └── album/           # 앨범 엔티티
├── features/             # 비즈니스 기능
│   ├── auth/            # 인증 기능
│   ├── gallery/         # 갤러리 기능
│   ├── upload/          # 업로드 기능
│   └── search/          # 검색 기능
├── widgets/              # 복합 위젯
│   ├── upload-modal/    # 업로드 모달
│   └── image-detail/    # 이미지 상세보기
├── stores/               # Zustand 전역 상태
├── contexts/             # Context API 도메인 상태
└── hooks/                # 통합 훅
```

## 🎯 레이어별 역할

### App Layer (Next.js App Router)
- **역할**: 라우팅, 레이아웃, API 엔드포인트
- **특징**: Next.js 15 App Router 사용
- **예시**: `app/dashboard/page.tsx`, `app/api/images/route.ts`

### Shared Layer (공유 리소스)
- **역할**: 재사용 가능한 유틸리티, UI 컴포넌트, 스타일
- **특징**: 프로젝트 전체에서 사용
- **예시**: `shared/ui/atoms/Button.tsx`, `shared/lib/utils.ts`

### Entities Layer (비즈니스 엔티티)
- **역할**: 비즈니스 도메인의 핵심 객체
- **특징**: API, 타입, 비즈니스 로직 포함
- **예시**: `entities/image/api/imageApi.ts`, `entities/user/model/types.ts`

### Features Layer (비즈니스 기능)
- **역할**: 특정 비즈니스 기능 구현
- **특징**: UI, 모델, API를 포함한 완전한 기능
- **예시**: `features/gallery/ui/ImageGrid.tsx`, `features/upload/model/useUpload.ts`

### Widgets Layer (복합 위젯)
- **역할**: 여러 기능을 조합한 복합 컴포넌트
- **특징**: 독립적으로 동작하는 위젯
- **예시**: `widgets/upload-modal/ui/ImageUploadModal.tsx`

## 🧩 Atomic Design 구조

### Atoms (원자)
- **역할**: 가장 기본적인 UI 컴포넌트
- **특징**: 재사용성 높음, 단일 책임
- **예시**: `Button`, `Input`, `Icon`

```typescript
// shared/ui/atoms/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

### Molecules (분자)
- **역할**: 여러 Atom을 조합한 컴포넌트
- **특징**: 특정 기능을 수행
- **예시**: `Card`, `Modal`, `SearchInput`

```typescript
// shared/ui/molecules/Card.tsx
interface CardProps {
  variant?: 'default' | 'elevated' | 'glass';
  children: React.ReactNode;
}
```

### Organisms (유기체)
- **역할**: 여러 Molecule을 조합한 복잡한 컴포넌트
- **특징**: 페이지의 특정 영역을 담당
- **예시**: `Header`, `ImageGallery`, `Navigation`

```typescript
// shared/ui/organisms/Header.tsx
interface HeaderProps {
  userName: string;
  onUploadClick: () => void;
  onLogout: () => void;
}
```

## 🔄 상태 관리 아키텍처

### Zustand (전역 상태)
- **용도**: 앱 전체에서 공유되는 상태
- **예시**: 사용자 인증, 테마, 알림

### Context API (도메인별 상태)
- **용도**: 특정 도메인에서만 사용되는 상태
- **예시**: 갤러리 선택, 업로드 진행률

### 클래스 서비스 (복잡한 비즈니스 로직)
- **용도**: 복잡한 상태 관리와 비즈니스 로직
- **예시**: `GalleryService`, `UploadService`

## 📁 파일 명명 규칙

### 컴포넌트
- **PascalCase**: `Button.tsx`, `ImageGrid.tsx`
- **폴더**: `kebab-case`: `upload-modal/`, `image-detail/`

### 훅
- **camelCase**: `useGallery.ts`, `useUpload.ts`
- **접두사**: `use`로 시작

### 유틸리티
- **camelCase**: `utils.ts`, `apiClient.ts`
- **타입**: `types.ts`, `interfaces.ts`

### 스토어
- **camelCase**: `authStore.ts`, `appStore.ts`
- **접미사**: `Store`로 끝남

## 🚀 개발 가이드라인

### 1. 새로운 기능 추가

```bash
# 1. Feature 폴더 생성
mkdir src/features/new-feature

# 2. 기본 구조 생성
mkdir src/features/new-feature/{ui,model,api}

# 3. 컴포넌트 생성
touch src/features/new-feature/ui/NewFeatureComponent.tsx
touch src/features/new-feature/model/useNewFeature.ts
```

### 2. 컴포넌트 작성 규칙

```typescript
// 1. 타입 정의
interface ComponentProps {
  // props 타입 정의
}

// 2. 컴포넌트 구현
export default function Component({ ...props }: ComponentProps) {
  // 구현
}

// 3. 기본값 설정
Component.defaultProps = {
  // 기본값
};
```

### 3. 상태 관리 규칙

```typescript
// 1. 전역 상태인지 확인
// - 앱 전체에서 사용? → Zustand
// - 특정 도메인에서만 사용? → Context API

// 2. 복잡한 비즈니스 로직인지 확인
// - 복잡한 상태 관리? → 클래스 서비스
// - 단순한 상태? → 훅 또는 Context
```

## 🧪 테스트 구조

```
src/
├── __tests__/           # 테스트 파일
│   ├── components/      # 컴포넌트 테스트
│   ├── hooks/          # 훅 테스트
│   ├── stores/         # 스토어 테스트
│   └── utils/          # 유틸리티 테스트
└── __mocks__/          # Mock 파일
    ├── api/            # API Mock
    └── components/     # 컴포넌트 Mock
```

## 📚 참고 자료

- [Feature-Sliced Design](https://feature-sliced.design/)
- [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [React Context API](https://react.dev/reference/react/createContext)

## 🤝 기여 가이드

새로운 기능을 추가할 때는 다음 순서를 따르세요:

1. **요구사항 분석**: 어떤 레이어에 속하는지 확인
2. **타입 정의**: TypeScript 인터페이스 작성
3. **구현**: 컴포넌트 또는 로직 구현
4. **테스트**: 단위 테스트 작성
5. **문서화**: README 업데이트
6. **리뷰**: 코드 리뷰 요청
