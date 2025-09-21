import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    isFirstLogin?: boolean; // 첫 로그인 여부
    sub?: string; // 사용자 고유 식별자
  }

  interface JWT {
    access_token?: string; // Cognito access token
    refresh_token?: string; // Cognito refresh token
    expires_at?: number; // Token 만료 시간
    isFirstLogin?: boolean; // 첫 로그인 여부
  }
}
