import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const logoutUri = `${baseUrl}/onboarding`;

  // 개발환경에서는 하드코딩된 URL, 프로덕션에서는 환경변수 사용
  const cognitoLogoutUrl = process.env.NODE_ENV === "production"
    ? `${process.env.COGNITO_ISSUER}/logout?client_id=${process.env.COGNITO_CLIENT_ID}&logout_uri=${encodeURIComponent(logoutUri)}`
    : "https://ap-northeast-2yom1zebnq.auth.ap-northeast-2.amazoncognito.com/logout?client_id=20ap0dntegf0l23cg3ukvu5id7&logout_uri=http%3A//localhost%3A3000/onboarding";

  return NextResponse.redirect(cognitoLogoutUrl);
}
