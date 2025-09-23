import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { createUnauthorizedResponse } from "./response";

/**
 * 세션 검증 결과 타입
 */
export interface SessionResult {
  session: any;
  error?: NextResponse;
}

/**
 * 세션 검증 함수
 */
export async function validateSession(): Promise<SessionResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return {
        session: null,
        error: createUnauthorizedResponse("Authentication required"),
      };
    }

    return { session };
  } catch (error) {
    console.error("Session validation error:", error);
    return {
      session: null,
      error: createUnauthorizedResponse("Session validation failed"),
    };
  }
}

/**
 * 요청에서 세션을 검증하고 사용자 정보를 반환
 */
export async function getAuthenticatedUser(): Promise<{
  user: any;
  error?: NextResponse;
}> {
  const { session, error } = await validateSession();

  if (error) {
    return { user: null, error };
  }

  return { user: session };
}

/**
 * JWT 토큰에서 사용자 ID 추출
 */
export function getUserIdFromSession(session: any): string | null {
  return session?.sub || null;
}

/**
 * 세션이 유효한지 확인
 */
export function isSessionValid(session: any): boolean {
  return !!(session?.accessToken && session.sub);
}

/**
 * Cognito 토큰이 유효한지 확인
 */
export function hasValidCognitoToken(session: any): boolean {
  return !!(session?.accessToken && session.accessToken.length > 0);
}

/**
 * Cognito 토큰을 포함한 인증된 사용자 정보 반환
 */
export async function getCognitoAuthenticatedUser(): Promise<{
  user: any;
  accessToken: string;
  error?: NextResponse;
}> {
  const data = await getAuthenticatedUser();
  const { user, error } = data;
  if (error) {
    return { user: null, accessToken: "", error };
  }

  if (!user.accessToken) {
    return {
      user: null,
      accessToken: "",
      error: createUnauthorizedResponse("Cognito access token not found"),
    };
  }

  return { user, accessToken: user.accessToken };
}
