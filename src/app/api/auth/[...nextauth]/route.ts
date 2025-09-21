import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";
import { FirstLoginService } from "@/shared/services/auth/firstLoginService";
import { TokenService } from "@/shared/services/auth/tokenService";

const authOptions: NextAuthOptions = {
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
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  events: {
    async signOut({ token }) {
      // 로그아웃 시 첫 로그인 쿠키 삭제
      if (token?.sub) {
        await FirstLoginService.clearFirstLoginCookie(token.sub);
      }
    },
  },
  callbacks: {
    async jwt({ token, account }) {
      // 초기 로그인 시 토큰 저장 및 첫 로그인 체크
      if (account) {
        const tokens = TokenService.extractTokensFromAccount(account);
        // NextAuth JWT 표준 키 이름 사용
        Object.assign(token, tokens);
        console.log("AUTH - token 1 >>>> ", token);

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
            (token as any).refreshToken = refreshedTokens.refreshToken;
          }
        } catch (error) {
          console.error("Token refresh error:", error);
          // 갱신 실패 시 토큰을 무효화하여 재인증 유도
          (token as any).accessToken = undefined;
          (token as any).expiresAt = 0;
          (token as any).error = "RefreshAccessTokenError";
          return token;
        }
      }
      console.log("AUTH - token 2 >>>> ", token);

      return token;
    },
    async session({ session, token }) {
      (session as any).isFirstLogin = token.isFirstLogin;
      (session as any).sub = token.sub;
      (session as any).accessToken = token.accessToken;

      return session;
    },
    async redirect({ url, baseUrl }) {
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
export { authOptions };
