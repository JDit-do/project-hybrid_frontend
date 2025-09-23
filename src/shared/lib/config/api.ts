/**
 * API 설정 - 환경별 URL 관리
 */

export interface ApiConfig {
  graphqlEndpoint: string;
  presignApi: string;
  cloudfrontDomain?: string;
  baseUrl: string;
}

/**
 * 개발 환경 API 설정
 */
const DEV_CONFIG: ApiConfig = {
  graphqlEndpoint: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!,
  presignApi: process.env.API_PRESIGN_API!,
  cloudfrontDomain: process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN_DEV,
  baseUrl:
    process.env.NEXT_PUBLIC_API_URL_DEV || "https://api.prism-memory.cloud",
};

/**
 * 프로덕션 환경 API 설정
 */
const PROD_CONFIG: ApiConfig = {
  graphqlEndpoint: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!,
  presignApi: process.env.API_PRESIGN_API!,
  cloudfrontDomain:
    process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN_PROD ||
    process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN,
  baseUrl:
    process.env.NEXT_PUBLIC_API_URL_PROD ||
    process.env.NEXT_PUBLIC_API_URL ||
    "",
};

/**
 * 현재 환경에 따른 API 설정 반환
 */
export function getApiConfig(): ApiConfig {
  const isDev = process.env.NODE_ENV === "development";
  const isProd = process.env.NODE_ENV === "production";

  // 환경 변수로 강제 설정 가능
  const forceDev = process.env.FORCE_DEV_API === "true";
  const forceProd = process.env.FORCE_PROD_API === "true";

  if (forceDev || (isDev && !forceProd)) {
    return DEV_CONFIG;
  }

  if (forceProd || isProd) {
    return PROD_CONFIG;
  }

  // 기본값은 개발 환경
  return DEV_CONFIG;
}

/**
 * 현재 API 설정 인스턴스
 */
export const apiConfig = getApiConfig();

/**
 * 환경별 설정 검증
 */
export function validateApiConfig(): void {
  const config = getApiConfig();
  const errors: string[] = [];

  if (!config.graphqlEndpoint) {
    errors.push("GraphQL endpoint is not configured");
  }

  if (!config.presignApi) {
    errors.push("Presign API endpoint is not configured");
  }

  if (errors.length > 0) {
    throw new Error(`API configuration errors: ${errors.join(", ")}`);
  }
}

/**
 * 환경 정보 출력 (디버깅용)
 */
export function logApiConfig(): void {
  if (process.env.NODE_ENV === "development") {
    console.log("🔧 API Configuration:", {
      environment: process.env.NODE_ENV,
      graphqlEndpoint: apiConfig.graphqlEndpoint,
      presignApi: apiConfig.presignApi,
      cloudfrontDomain: apiConfig.cloudfrontDomain,
      baseUrl: apiConfig.baseUrl,
    });
  }
}
