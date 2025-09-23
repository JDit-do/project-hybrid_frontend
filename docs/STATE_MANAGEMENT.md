# 상태 관리 아키텍처

## 📋 개요

Prism Memory는 **Zustand + Context API 하이브리드 접근법**을 사용하여 상태를 관리합니다.

- **Zustand**: 전역 앱 상태 (인증, 설정, UI)
- **Context API**: 도메인별 상태 (갤러리, 업로드, 검색)

## 🏗️ 아키텍처 구조

```
src/
├── stores/           # Zustand 전역 상태
│   ├── authStore.ts  # 사용자 인증
│   ├── appStore.ts   # 앱 전역 설정
│   └── index.ts      # 스토어 exports
├── contexts/         # Context API 도메인 상태
│   ├── GalleryContext.tsx  # 갤러리 관련 상태
│   ├── UploadContext.tsx   # 업로드 관련 상태
│   └── index.tsx     # 컨텍스트 exports
└── hooks/           # 통합 훅
    └── useStores.ts  # 모든 상태를 통합하는 훅
```

## 🎯 상태 분류

### Zustand (전역 상태)

| 스토어 | 용도 | 주요 상태 |
|--------|------|-----------|
| `authStore` | 사용자 인증 | `user`, `isAuthenticated`, `isLoading` |
| `appStore` | 앱 전역 설정 | `sidebarOpen`, `theme`, `notifications`, `modals` |

### Context API (도메인별 상태)

| 컨텍스트 | 용도 | 주요 상태 |
|----------|------|-----------|
| `GalleryContext` | 갤러리 관리 | `currentAlbum`, `selectedImages`, `viewMode` |
| `UploadContext` | 업로드 관리 | `uploads`, `isUploading`, `dragActive` |

## 🚀 사용법

### 1. 기본 사용법

```typescript
import { useStores } from '@/hooks/useStores';

function MyComponent() {
  const { auth, app, gallery, upload } = useStores();
  
  return (
    <div>
      <p>사용자: {auth.user?.name}</p>
      <p>선택된 이미지: {gallery.selectedImages.length}개</p>
    </div>
  );
}
```

### 2. 개별 스토어 사용

```typescript
import { useAuth, useApp, useGallery, useUpload } from '@/hooks/useStores';

function AuthComponent() {
  const { user, login, logout } = useAuth();
  // ...
}

function GalleryComponent() {
  const { selectedImages, toggleImageSelection } = useGallery();
  // ...
}
```

### 3. Zustand 스토어 직접 사용

```typescript
import { useAuthStore, useAppStore } from '@/stores';

function DirectStoreComponent() {
  const user = useAuthStore(state => state.user);
  const sidebarOpen = useAppStore(state => state.sidebarOpen);
  // ...
}
```

## 📝 스토어 상세

### AuthStore (인증)

```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateUser: (updates: Partial<User>) => void;
}
```

**특징:**
- 로컬 스토리지에 자동 저장 (persist)
- NextAuth와 연동 가능
- 에러 상태 관리

### AppStore (앱 전역)

```typescript
interface AppState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  notifications: Notification[];
  modals: {
    upload: boolean;
    imageDetail: boolean;
    settings: boolean;
  };
  
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  openModal: (modal: keyof AppState['modals']) => void;
}
```

**특징:**
- 테마 자동 적용
- 알림 자동 만료
- 모달 상태 관리

### GalleryContext (갤러리)

```typescript
interface GalleryContextValue {
  currentAlbum: Album | null;
  selectedImages: string[];
  viewMode: 'grid' | 'list';
  sortBy: 'newest' | 'oldest' | 'title' | 'size';
  
  selectAlbum: (album: Album | null) => void;
  toggleImageSelection: (imageId: string) => void;
  changeViewMode: (mode: 'grid' | 'list') => void;
  deleteSelectedImages: () => void;
}
```

**특징:**
- 앨범별 상태 관리
- 다중 이미지 선택
- 벌크 작업 지원

### UploadContext (업로드)

```typescript
interface UploadContextValue {
  uploads: UploadProgress[];
  isUploading: boolean;
  dragActive: boolean;
  uploadStats: {
    total: number;
    success: number;
    error: number;
    uploading: number;
  };
  
  addUpload: (file: File) => void;
  updateUploadProgress: (id: string, progress: number) => void;
  retryUpload: (id: string) => void;
  uploadFiles: (files: File[]) => void;
}
```

**특징:**
- 실시간 진행률 추적
- 드래그앤드롭 지원
- 재시도 기능
- 통계 제공

## 🔄 상태 간 상호작용

### Zustand → Context API

```typescript
// Context에서 Zustand 상태 구독
export const GalleryProvider = ({ children }) => {
  const { user } = useAuthStore(); // Zustand에서 사용자 정보
  
  useEffect(() => {
    if (user) {
      // 사용자 변경 시 갤러리 상태 초기화
      setCurrentAlbum(null);
    }
  }, [user]);
  
  // ...
};
```

### Context API → Zustand

```typescript
// Context에서 Zustand 액션 호출
export const useGalleryContext = () => {
  const { addNotification } = useAppStore(); // Zustand 액션
  
  const selectAlbum = (album: Album) => {
    setCurrentAlbum(album);
    // 전역 알림 추가
    addNotification({
      type: 'success',
      message: `"${album.name}" 앨범을 선택했습니다.`,
    });
  };
  
  return { selectAlbum, ... };
};
```

## 🎨 Provider 설정

```typescript
// app/providers.tsx
export default function Providers({ children }) {
  return (
    <SessionProvider>
      <GalleryProvider>
        <UploadProvider>
          {children}
        </UploadProvider>
      </GalleryProvider>
    </SessionProvider>
  );
}
```

## 🧪 테스트

### Zustand 스토어 테스트

```typescript
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '@/stores/authStore';

test('should login user', () => {
  const { result } = renderHook(() => useAuthStore());
  
  act(() => {
    result.current.login({ id: '1', name: 'John', email: 'john@example.com' });
  });
  
  expect(result.current.isAuthenticated).toBe(true);
  expect(result.current.user?.name).toBe('John');
});
```

### Context API 테스트

```typescript
import { render, screen } from '@testing-library/react';
import { GalleryProvider, useGalleryContext } from '@/contexts/GalleryContext';

const TestComponent = () => {
  const { selectedImages, toggleImageSelection } = useGalleryContext();
  return (
    <div>
      <span>{selectedImages.length}</span>
      <button onClick={() => toggleImageSelection('1')}>Toggle</button>
    </div>
  );
};

test('should toggle image selection', () => {
  render(
    <GalleryProvider>
      <TestComponent />
    </GalleryProvider>
  );
  
  expect(screen.getByText('0')).toBeInTheDocument();
  
  fireEvent.click(screen.getByText('Toggle'));
  expect(screen.getByText('1')).toBeInTheDocument();
});
```

## 🚀 성능 최적화

### 1. 선택적 구독

```typescript
// 필요한 상태만 구독
const user = useAuthStore(state => state.user);
const isAuthenticated = useAuthStore(state => state.isAuthenticated);

// 여러 상태를 한 번에 구독
const { user, isAuthenticated } = useAuthStore(state => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
}));
```

### 2. 메모이제이션

```typescript
const selectUser = useCallback((state: AuthState) => state.user, []);
const user = useAuthStore(selectUser);
```

### 3. Context 분할

```typescript
// 큰 Context를 작은 단위로 분할
const GalleryStateContext = createContext();
const GalleryActionsContext = createContext();
```

## 📚 참고 자료

- [Zustand 공식 문서](https://zustand-demo.pmnd.rs/)
- [React Context API](https://react.dev/reference/react/createContext)
- [Next.js App Router](https://nextjs.org/docs/app)

## 🤝 기여 가이드

새로운 상태를 추가할 때는 다음 규칙을 따르세요:

1. **전역 상태** → Zustand 스토어에 추가
2. **도메인별 상태** → Context API에 추가
3. **통합 훅** → `useStores.ts`에 추가
4. **타입 정의** → 각 스토어/컨텍스트 파일에 추가
5. **테스트 작성** → 각 상태 변경에 대한 테스트 추가
