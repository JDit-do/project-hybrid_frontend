'use client';

import { useState, useCallback } from 'react';
import { ApiError } from '../api/apiClient';

export interface ErrorState {
  hasError: boolean;
  message: string;
  code?: string;
  retryCount: number;
  lastError?: Error;
}

export interface UseErrorHandlerOptions {
  maxRetries?: number;
  onError?: (error: Error) => void;
  onRetry?: (retryCount: number) => void;
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const { maxRetries = 3, onError, onRetry } = options;
  
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    message: '',
    retryCount: 0,
  });

  const handleError = useCallback((error: Error, context?: string) => {
    console.error(`Error in ${context || 'unknown context'}:`, error);
    
    const apiError = error as ApiError;
    const message = getErrorMessage(apiError);
    
    setErrorState({
      hasError: true,
      message,
      code: apiError.code,
      retryCount: errorState.retryCount + 1,
      lastError: error,
    });

    onError?.(error);
  }, [errorState.retryCount, onError]);

  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      message: '',
      retryCount: 0,
    });
  }, []);

  const retry = useCallback(() => {
    if (errorState.retryCount < maxRetries) {
      setErrorState(prev => ({
        ...prev,
        hasError: false,
        message: '',
      }));
      onRetry?.(errorState.retryCount);
    }
  }, [errorState.retryCount, maxRetries, onRetry]);

  const canRetry = errorState.retryCount < maxRetries;

  return {
    errorState,
    handleError,
    clearError,
    retry,
    canRetry,
  };
}

function getErrorMessage(error: ApiError): string {
  if (error.name === 'AbortError') {
    return '요청 시간이 초과되었습니다. 네트워크 연결을 확인해주세요.';
  }

  if (error.status) {
    switch (error.status) {
      case 400:
        return '잘못된 요청입니다. 입력값을 확인해주세요.';
      case 401:
        return '로그인이 필요합니다. 다시 로그인해주세요.';
      case 403:
        return '접근 권한이 없습니다.';
      case 404:
        return '요청한 데이터를 찾을 수 없습니다.';
      case 429:
        return '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.';
      case 500:
        return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      case 502:
      case 503:
      case 504:
        return '서버가 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.';
      default:
        return `서버 오류가 발생했습니다. (${error.status})`;
    }
  }

  if (error.message.includes('Failed to fetch')) {
    return '네트워크 연결을 확인해주세요.';
  }

  return error.message || '알 수 없는 오류가 발생했습니다.';
}
