/**
 * 환경 변수 검증 및 관리
 */

/**
 * 필수 환경 변수 검증
 */
export function validateRequiredEnvVars() {
  const requiredVars = [
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'COGNITO_CLIENT_ID',
    'COGNITO_CLIENT_SECRET',
    'COGNITO_ISSUER',
    'APP_SYNC_URL',
    'NEXT_PUBLIC_PRESIGN_API',
  ];

  const missingVars: string[] = [];

  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }
}

/**
 * 환경 변수 가져오기 (필수)
 */
export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
}

/**
 * 환경 변수 가져오기 (선택적)
 */
export function getOptionalEnv(key: string, defaultValue?: string): string | undefined {
  return process.env[key] || defaultValue;
}

/**
 * 개발 환경 확인
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * 프로덕션 환경 확인
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * 환경별 설정
 */
export const ENV_CONFIG = {
  // 개발 환경에서는 환경 변수 검증을 건너뛸 수 있음
  skipValidation: isDevelopment() && process.env.SKIP_ENV_VALIDATION === 'true',
  
  // 개발 환경에서 Mock API 사용 여부
  useMockApis: isDevelopment() && process.env.USE_MOCK_APIS === 'true',
} as const;











