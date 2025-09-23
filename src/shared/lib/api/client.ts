// API Client - UI 테스트를 위해 주석 처리
/*
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// HTTP 링크 생성
const httpLink = createHttpLink({
  uri: '/api/graphql', // Next.js API 라우트를 통해 GraphQL 요청
});

// 인증 헤더 추가
const authLink = setContext((_, { headers }) => {
  // 클라이언트에서는 세션에서 토큰을 가져와야 함
  // 이는 각 컴포넌트에서 처리
  return {
    headers: {
      ...headers,
      // Authorization 헤더는 서버사이드에서 처리됨
    }
  };
});

// Apollo Client 생성
export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          listMemoryImageMetadata: {
            keyArgs: false,
            merge(existing, incoming) {
              if (!existing) return incoming;
              return {
                ...incoming,
                items: [...existing.items, ...incoming.items],
              };
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

// REST API 클라이언트
export class RestClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}

// 기본 REST 클라이언트 인스턴스
export const restClient = new RestClient();
*/

// UI 테스트용 Mock 클라이언트
export const apolloClient = {
  query: () => {
    console.log("Apollo Client - UI 테스트용 Mock 응답");
    return Promise.resolve({ data: null });
  },
  mutate: () => {
    console.log("Apollo Client - UI 테스트용 Mock 응답");
    return Promise.resolve({ data: null });
  },
};

export class RestClient {
  constructor() {
    console.log("RestClient - UI 테스트용 Mock 클라이언트");
  }

  async get<T>(): Promise<T> {
    console.log("RestClient.get - UI 테스트용 Mock 응답");
    throw new Error("RestClient is disabled for UI testing");
  }

  async post<T>(): Promise<T> {
    console.log("RestClient.post - UI 테스트용 Mock 응답");
    throw new Error("RestClient is disabled for UI testing");
  }

  async put<T>(): Promise<T> {
    console.log("RestClient.put - UI 테스트용 Mock 응답");
    throw new Error("RestClient is disabled for UI testing");
  }

  async delete<T>(): Promise<T> {
    console.log("RestClient.delete - UI 테스트용 Mock 응답");
    throw new Error("RestClient is disabled for UI testing");
  }
}

export const restClient = new RestClient();
