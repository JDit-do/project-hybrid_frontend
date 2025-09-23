import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

/**
 * 서버사이드 인증 확인 유틸리티
 * Server Component에서 사용
 */
export async function requireAuth(redirectTo: string = "/onboarding") {
  const session = await getServerSession();
  
  if (!session) {
    redirect(redirectTo);
  }
  
  return session;
}

/**
 * 서버사이드 인증 확인 (옵셔널)
 * Server Component에서 사용
 */
export async function getOptionalAuth() {
  return await getServerSession();
}











