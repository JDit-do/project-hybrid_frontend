# 개발 환경 설정 가이드

## 로컬 개발 환경 설정

### 1. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# 필수 설정
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# AWS Cognito (실제 값 필요)
COGNITO_CLIENT_ID=your-cognito-client-id
COGNITO_CLIENT_SECRET=your-cognito-client-secret
COGNITO_ISSUER=https://your-cognito-domain.auth.region.amazoncognito.com

# 개발용 설정 (Mock API 사용)
USE_MOCK_APIS=true
SKIP_ENV_VALIDATION=true

# AWS 서비스 (Mock API 사용 시 불필요)
# APP_SYNC_URL=https://your-appsync-url.amazonaws.com/graphql
# NEXT_PUBLIC_PRESIGN_API=https://your-presign-api.com/api/presign
```

### 2. 개발 모드 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

## Mock API 사용

개발 환경에서 실제 AWS 서비스 없이도 프론트엔드 개발이 가능하도록 Mock API를 제공합니다.

### Mock API 활성화

`.env.local`에 다음 설정을 추가하세요:

```env
USE_MOCK_APIS=true
```

### Mock API 기능

- **GraphQL API**: 실제 AppSync 쿼리에 대한 Mock 응답 제공
- **Presign API**: S3 업로드를 위한 Mock presigned URL 생성
- **네트워크 지연 시뮬레이션**: 실제 API 호출과 유사한 경험 제공

### Mock 데이터

Mock API는 다음과 같은 샘플 데이터를 제공합니다:

- 이미지 메타데이터 목록
- 사용자별 정렬된 이미지 데이터
- 카테고리별 이미지 그룹핑

## 프로덕션 배포

프로덕션 환경에서는 실제 AWS 서비스 URL을 설정해야 합니다:

```env
# 프로덕션 설정
USE_MOCK_APIS=false
SKIP_ENV_VALIDATION=false

# 실제 AWS 서비스 URL
APP_SYNC_URL=https://your-appsync-url.amazonaws.com/graphql
NEXT_PUBLIC_PRESIGN_API=https://your-presign-api.com/api/presign
```

## 문제 해결

### 환경 변수 오류

환경 변수가 설정되지 않았다는 오류가 발생하는 경우:

1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. `USE_MOCK_APIS=true` 설정이 있는지 확인
3. 서버를 재시작

### Mock API가 작동하지 않는 경우

1. `USE_MOCK_APIS=true` 설정 확인
2. 브라우저 개발자 도구에서 콘솔 로그 확인
3. "Using Mock GraphQL API" 메시지가 출력되는지 확인

## 개발 팁

- Mock API는 실제 API와 동일한 응답 형식을 제공합니다
- 네트워크 탭에서 Mock 응답을 확인할 수 있습니다
- 실제 AWS 서비스 연동 전에 UI/UX 개발을 완료할 수 있습니다










