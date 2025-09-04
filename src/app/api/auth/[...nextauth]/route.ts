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
          scope:
            "openid https://api.prism-memory.cloud/file.upload email profile",
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
    async redirect({ baseUrl }) {
      return baseUrl + "/";
    },

    async jwt({ token, account }) {
      if (account) {
        if (account.access_token) token.access_token = account.access_token;
        if (account.id_token) token.id_token = account.id_token;
        if (account.expires_at) token.expires_at = account.expires_at;
      }

      return token;
    },
    async session({ session, token }) {
      session.access_token = token.access_token as string | undefined;
      session.id_token = token.id_token as string | undefined;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
