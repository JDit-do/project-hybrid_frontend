/**
 * API 응답 상태 코드
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * API 에러 메시지
 */
export const ERROR_MESSAGES = {
  // 인증 관련
  UNAUTHORIZED: 'Authentication required',
  INVALID_TOKEN: 'Invalid or expired token',
  SESSION_EXPIRED: 'Session has expired',
  
  // 권한 관련
  FORBIDDEN: 'Access denied',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
  
  // 요청 관련
  BAD_REQUEST: 'Invalid request',
  MISSING_REQUIRED_FIELD: 'Missing required field',
  INVALID_INPUT: 'Invalid input data',
  
  // 리소스 관련
  NOT_FOUND: 'Resource not found',
  ALREADY_EXISTS: 'Resource already exists',
  CONFLICT: 'Resource conflict',
  
  // 서버 관련
  INTERNAL_ERROR: 'Internal server error',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
  DATABASE_ERROR: 'Database operation failed',
  
  // GraphQL 관련
  GRAPHQL_ERROR: 'GraphQL request failed',
  INVALID_QUERY: 'Invalid GraphQL query',
  
  // Cognito 관련
  COGNITO_ERROR: 'Cognito authentication failed',
  TOKEN_REFRESH_FAILED: 'Token refresh failed',
  
  // 파일 업로드 관련
  FILE_TOO_LARGE: 'File size exceeds limit',
  INVALID_FILE_TYPE: 'Invalid file type',
  UPLOAD_FAILED: 'File upload failed',
} as const;

/**
 * API 성공 메시지
 */
export const SUCCESS_MESSAGES = {
  // 일반
  SUCCESS: 'Operation completed successfully',
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  
  // 인증 관련
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  
  // 사용자 관련
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  USER_INFO_RETRIEVED: 'User information retrieved successfully',
  
  // GraphQL 관련
  GRAPHQL_SUCCESS: 'GraphQL request successful',
  
  // Cognito 관련
  COGNITO_AUTH_SUCCESS: 'Cognito authentication successful',
  
  // 파일 관련
  FILE_UPLOADED: 'File uploaded successfully',
  FILE_DELETED: 'File deleted successfully',
} as const;

/**
 * API 에러 코드
 */
export const ERROR_CODES = {
  // 인증 관련
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // 권한 관련
  ACCESS_DENIED: 'ACCESS_DENIED',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  
  // 요청 관련
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  MISSING_PARAMETER: 'MISSING_PARAMETER',
  
  // 리소스 관련
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  
  // 서버 관련
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
} as const;
