import CognitoProvider from "next-auth/providers/cognito";
import { FirstLoginService } from "@/shared/services/auth/firstLoginService";
import { TokenService } from "@/shared/services/auth/tokenService";

export const authOptions = {
  providers: [
    CognitoProvider({
      issuer: process.env.COGNITO_ISSUER,
      clientId: process.env.COGNITO_CLIENT_ID!,
      clientSecret: process.env.COGNITO_CLIENT_SECRET!,

      authorization: {
        params: {
          scope:
            "openid profile email https://api.prism-memory.cloud/file.upload",
          prompt: "select_account",
          identity_provider: "Google",
        },
      },

      checks: ["pkce", "state", "nonce"],
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/login",
  },
  events: {
    async signOut({ token }: { token: any }) {
      // 로그아웃 시 첫 로그인 쿠키 삭제
      if (token?.sub) {
        await FirstLoginService.clearFirstLoginCookie(token.sub);
      }
    },
  },
  callbacks: {
    async jwt({ token, account }: { token: any; account: any }) {
      // 초기 로그인 시 토큰 저장 및 첫 로그인 체크
      if (account) {
        // accessToken을 JWT 토큰에 직접 저장
        (token as { accessToken?: string }).accessToken = account.access_token;

        const tokens = TokenService.extractTokensFromAccount(account);
        // NextAuth JWT 표준 키 이름 사용
        Object.assign(token, tokens);

        const isFirstLogin = await FirstLoginService.checkAndSetFirstLogin(
          account.providerAccountId
        );
        token.isFirstLogin = isFirstLogin;
      }

      // Token 만료 시간 검증 (5분 여유를 두고 갱신)
      const now = Math.floor(Date.now() / 1000);
      const expiresAt = token.expiresAt as number;
      const shouldRefresh = !expiresAt || expiresAt - now < 300; // 5분 전에 갱신

      if (!shouldRefresh) {
        return token;
      }

      // Token 갱신 시도
      if (token.refreshToken) {
        try {
          console.log("Token 갱신 시도 중...");
          const refreshedTokens = await TokenService.refreshToken(
            token.refreshToken as string
          );

          // 갱신된 토큰으로 업데이트
          Object.assign(token, refreshedTokens);
          // refresh_token 회전이 일어난 경우 새 값 유지
          if (refreshedTokens.refreshToken) {
            (token as { refreshToken?: string }).refreshToken =
              refreshedTokens.refreshToken;
          }
        } catch (error) {
          console.error("Token refresh error:", error);
          // 갱신 실패 시 토큰을 무효화하여 재인증 유도
          (
            token as {
              accessToken?: string;
              expiresAt?: number;
              error?: string;
            }
          ).accessToken = undefined;
          (
            token as {
              accessToken?: string;
              expiresAt?: number;
              error?: string;
            }
          ).expiresAt = 0;
          (
            token as {
              accessToken?: string;
              expiresAt?: number;
              error?: string;
            }
          ).error = "RefreshAccessTokenError";
          return token;
        }
      }

      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      // session을 1depth로 평면화하되 Session 타입에 맞게 구성
      return {
        user: {
          email: session.user?.email,
          name: session.user?.name,
          image: session.user?.image,
        },
        expires: session.expires,
        isFirstLogin: token.isFirstLogin as boolean,
        sub: token.sub as string,
        accessToken: token.accessToken as string,
      };
    },
    async redirect({ url, baseUrl }: { url: any; baseUrl: any }) {
      // 로그인 성공 후 login-success로 리다이렉트
      if (url === baseUrl || url === baseUrl + "/") {
        return baseUrl + "/login-success";
      }

      // 다른 URL이면 그대로 사용
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl;
    },
  },
};
