interface OAuthAccountLike {
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
}

/**
 * 토큰 관리 서비스
 * Cognito 토큰 저장, 갱신, 검증 로직
 */
export class TokenService {
  /**
   * 토큰이 유효한지 확인
   */
  static isTokenValid(expiresAt?: number): boolean {
    if (!expiresAt) return false;
    return Date.now() < expiresAt * 1000;
  }

  /**
   * Account에서 토큰 정보 추출
   */
  static extractTokensFromAccount(account: OAuthAccountLike) {
    return {
      accessToken: account.access_token,
      refreshToken: account.refresh_token,
      expiresAt: account.expires_at,
    };
  }

  /**
   * 토큰 갱신 시도
   */
  static async refreshToken(refreshToken: string): Promise<{
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }> {
    try {
      const basic = Buffer.from(
        `${process.env.COGNITO_CLIENT_ID!}:${process.env.COGNITO_CLIENT_SECRET!}`
      ).toString("base64");
      const response = await fetch(`${process.env.COGNITO_ISSUER}/oauth2/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${basic}`,
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Token refresh failed: ${response.status} - ${text}`);
      }

      const data = await response.json();
      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || refreshToken,
        expiresAt: data.expires_in
          ? Math.floor(Date.now() / 1000) + data.expires_in
          : undefined,
      };
    } catch (error) {
      console.error("Token refresh error:", error);
      throw error;
    }
  }
}









