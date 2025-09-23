import { cookies } from "next/headers";
import crypto from "crypto";

/**
 * 첫 로그인 관련 서비스
 * 사용자별 첫 로그인 상태를 쿠키로 관리
 */
export class FirstLoginService {
  private static readonly COOKIE_PREFIX = "prism_memory_ob_";
  private static readonly COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1년

  /**
   * 사용자 식별자로 쿠키명 생성
   */
  private static cookieNameFor(sub: string): string {
    const h = crypto.createHash("sha256").update(sub).digest("hex").slice(0, 12);
    return `${this.COOKIE_PREFIX}${h}`;
  }

  /**
   * 첫 로그인 여부 확인 및 쿠키 설정
   */
  static async checkAndSetFirstLogin(sub: string): Promise<boolean> {
    try {
      if (!sub) return true; // 식별자가 없으면 첫 로그인으로 간주

      const jar = await cookies();
      const cookieName = this.cookieNameFor(sub);
      const isFirstLogin = jar.get(cookieName)?.value !== "1";

      if (isFirstLogin) {
        // 첫 로그인 - 쿠키 설정
        jar.set({
          name: cookieName,
          value: "1",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: this.COOKIE_MAX_AGE,
        });
      }

      return isFirstLogin;
    } catch (error) {
      console.error("First login check error:", error);
      return true; // 에러 시 첫 로그인으로 간주
    }
  }

  /**
   * 첫 로그인 쿠키 삭제 (로그아웃 시)
   */
  static async clearFirstLoginCookie(sub: string): Promise<void> {
    try {
      if (!sub) return;

      const jar = await cookies();
      const cookieName = this.cookieNameFor(sub);

      jar.set({
        name: cookieName,
        value: "",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0, // 즉시 만료
      });
    } catch (error) {
      console.error("Error clearing first login cookie:", error);
    }
  }
}











