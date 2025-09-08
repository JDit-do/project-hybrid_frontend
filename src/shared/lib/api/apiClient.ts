interface ApiError extends Error {
  status?: number;
  code?: string;
}

interface RequestCache {
  data: unknown;
  timestamp: number;
}

// 전역 캐시와 요청 추적
const requestCache = new Map<string, RequestCache>();
const activeRequests = new Map<string, Promise<unknown>>();

const CACHE_DURATION = 30000; // 30초
const MAX_RETRIES = 3;
const TIMEOUT = 8000; // 8초로 단축
const RETRY_DELAY = 1000;

// 유틸리티 함수들
const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

const createAbortController = (timeout: number) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  return { controller, timeoutId };
};

const getCacheKey = (url: string, options: RequestInit): string => {
  return `${url}:${JSON.stringify(options)}`;
};

const getCachedData = (key: string): unknown | null => {
  const cached = requestCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  requestCache.delete(key);
  return null;
};

const setCachedData = (key: string, data: unknown): void => {
  requestCache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

const fetchWithTimeout = async (url: string, options: RequestInit): Promise<Response> => {
  const { controller, timeoutId } = createAbortController(TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  attempt: number = 1
): Promise<T> => {
  try {
    return await requestFn();
  } catch (error) {
    // 404 에러는 재시도하지 않음
    if (error instanceof Error && error.message.includes('404')) {
      console.error('❌ 404 Not Found - 재시도하지 않음:', error.message);
      throw error;
    }
    
    // 401, 403 에러도 재시도하지 않음
    if (error instanceof Error && (error.message.includes('401') || error.message.includes('403'))) {
      console.error('❌ 인증/권한 오류 - 재시도하지 않음:', error.message);
      throw error;
    }
    
    if (attempt >= MAX_RETRIES) {
      console.error(`API 요청 최종 실패 (${attempt}/${MAX_RETRIES}):`, error);
      throw error;
    }

    const delayMs = RETRY_DELAY * Math.pow(2, attempt - 1);
    console.warn(`API 요청 실패 (${attempt}/${MAX_RETRIES}), ${delayMs}ms 후 재시도...`, error);
    
    await delay(delayMs);
    return retryRequest(requestFn, attempt + 1);
  }
};

// API 함수들
export const apiGet = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL || ''}${endpoint}`;
  const cacheKey = getCacheKey(url, options);
  
  // 캐시 확인
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    console.log('Using cached data for:', endpoint);
    return cachedData as T;
  }

  // 중복 요청 방지
  if (activeRequests.has(cacheKey)) {
    console.log('Request already in progress for:', endpoint);
    return activeRequests.get(cacheKey)! as Promise<T>;
  }

  const requestPromise = retryRequest(async () => {
    const response = await fetchWithTimeout(url, {
      ...options,
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const error: ApiError = new Error(`HTTP ${response.status}: ${response.statusText}`);
      error.status = response.status;
      error.code = response.status.toString();
      throw error;
    }

    const data = await response.json();
    setCachedData(cacheKey, data);
    return data;
  });

  // 요청 추적
  activeRequests.set(cacheKey, requestPromise);
  
  try {
    const result = await requestPromise;
    return result;
  } finally {
    activeRequests.delete(cacheKey);
  }
};

export const apiPost = async <T>(endpoint: string, data?: unknown, options: RequestInit = {}): Promise<T> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL || ''}${endpoint}`;
  
  return retryRequest(async () => {
    const response = await fetchWithTimeout(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const error: ApiError = new Error(`HTTP ${response.status}: ${response.statusText}`);
      error.status = response.status;
      error.code = response.status.toString();
      throw error;
    }

    return response.json();
  });
};

export const apiPatch = async <T>(endpoint: string, data?: unknown, options: RequestInit = {}): Promise<T> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL || ''}${endpoint}`;
  
  return retryRequest(async () => {
    const response = await fetchWithTimeout(url, {
      ...options,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const error: ApiError = new Error(`HTTP ${response.status}: ${response.statusText}`);
      error.status = response.status;
      error.code = response.status.toString();
      throw error;
    }

    return response.json();
  });
};

export const apiDelete = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL || ''}${endpoint}`;
  
  return retryRequest(async () => {
    const response = await fetchWithTimeout(url, {
      ...options,
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const error: ApiError = new Error(`HTTP ${response.status}: ${response.statusText}`);
      error.status = response.status;
      error.code = response.status.toString();
      throw error;
    }

    return response.json();
  });
};

// 캐시 관리 함수들
export const clearApiCache = (): void => {
  requestCache.clear();
  activeRequests.clear();
};

export const clearApiCacheForEndpoint = (endpoint: string): void => {
  const keysToDelete = Array.from(requestCache.keys()).filter(key => 
    key.includes(endpoint)
  );
  keysToDelete.forEach(key => requestCache.delete(key));
};

export type { ApiError };
