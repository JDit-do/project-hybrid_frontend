import NextAuth from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";

const handler = NextAuth({
  providers: [
    CognitoProvider({
      issuer: process.env.COGNITO_ISSUER,
      clientId: process.env.COGNITO_CLIENT_ID!,
      clientSecret: process.env.COGNITO_CLIENT_SECRET!,

      authorization: {
        params: {
          scope: "openid",
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
  callbacks: {
    async redirect({ url, baseUrl }) {
      // 로그인 성공 시 항상 홈으로
      return baseUrl + "/";
    },
  },
});

export { handler as GET, handler as POST };
