import { NextResponse } from 'next/server';
import { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES, ERROR_CODES } from './constants';

/**
 * API 응답 타입 정의
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
  message?: string;
  status: number;
}

/**
 * 성공 응답 생성
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status: number = HTTP_STATUS.OK
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message: message || SUCCESS_MESSAGES.SUCCESS,
      status,
    },
    { status }
  );
}

/**
 * 에러 응답 생성
 */
export function createErrorResponse(
  errorCode: string,
  status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  message?: string
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: errorCode,
      errorCode,
      message: message || ERROR_MESSAGES.INTERNAL_ERROR,
      status,
    },
    { status }
  );
}

/**
 * 인증 에러 응답
 */
export function createUnauthorizedResponse(
  message: string = ERROR_MESSAGES.UNAUTHORIZED
): NextResponse<ApiResponse> {
  return createErrorResponse(ERROR_CODES.AUTH_REQUIRED, HTTP_STATUS.UNAUTHORIZED, message);
}

/**
 * 잘못된 요청 에러 응답
 */
export function createBadRequestResponse(
  message: string = ERROR_MESSAGES.BAD_REQUEST
): NextResponse<ApiResponse> {
  return createErrorResponse(ERROR_CODES.VALIDATION_ERROR, HTTP_STATUS.BAD_REQUEST, message);
}

/**
 * 서버 에러 응답
 */
export function createServerErrorResponse(
  message: string = ERROR_MESSAGES.INTERNAL_ERROR
): NextResponse<ApiResponse> {
  return createErrorResponse(ERROR_CODES.INTERNAL_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR, message);
}

/**
 * 찾을 수 없음 에러 응답
 */
export function createNotFoundResponse(
  message: string = ERROR_MESSAGES.NOT_FOUND
): NextResponse<ApiResponse> {
  return createErrorResponse(ERROR_CODES.RESOURCE_NOT_FOUND, HTTP_STATUS.NOT_FOUND, message);
}

/**
 * 권한 거부 에러 응답
 */
export function createForbiddenResponse(
  message: string = ERROR_MESSAGES.FORBIDDEN
): NextResponse<ApiResponse> {
  return createErrorResponse(ERROR_CODES.ACCESS_DENIED, HTTP_STATUS.FORBIDDEN, message);
}

/**
 * 공통 에러 처리 함수
 */
export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  console.error('API Error:', error);

  if (error instanceof Error) {
    // 특정 에러 타입에 따른 처리
    if (error.message.includes('Unauthorized')) {
      return createUnauthorizedResponse(error.message);
    }
    if (error.message.includes('Forbidden')) {
      return createForbiddenResponse(error.message);
    }
    if (error.message.includes('Not Found')) {
      return createNotFoundResponse(error.message);
    }
    if (error.message.includes('Bad Request')) {
      return createBadRequestResponse(error.message);
    }
    
    return createServerErrorResponse(error.message);
  }

  return createServerErrorResponse('Unknown error occurred');
}

/**
 * API 요청 래퍼 함수
 */
export async function withApiHandler<T>(
  handler: () => Promise<T>,
  successMessage?: string
): Promise<NextResponse<ApiResponse<T>>> {
  try {
    const result = await handler();
    return createSuccessResponse(result, successMessage);
  } catch (error) {
    return handleApiError(error);
  }
}
