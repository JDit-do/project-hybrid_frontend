import { ApolloClient, InMemoryCache } from "@apollo/client";
import { HttpLink } from "@apollo/client/link/http";
import { SetContextLink } from "@apollo/client/link/context";
import { getSession } from "next-auth/react";
import { apiConfig, logApiConfig } from "@/shared/lib/config/api";

// 환경별 설정 로깅
logApiConfig();

// HTTP Link 생성
const httpLink = new HttpLink({
  uri: apiConfig.graphqlEndpoint,
});

// 인증 헤더 추가: NextAuth 세션에서 accessToken을 안전하게 가져오기
const authLink = new SetContextLink(async (prevContext) => {
  try {
    const session = await getSession();
    const accessToken = (session as any)?.accessToken as string | undefined;
    return {
      headers: {
        ...(prevContext?.headers as Record<string, string> | undefined),
        authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
    };
  } catch (e) {
    return {
      headers: prevContext?.headers as Record<string, string> | undefined,
    };
  }
});

// Apollo Client 생성
export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          images: {
            keyArgs: false,
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
  },
});

export default apolloClient;
