// User Me API - UI 테스트를 위해 주석 처리
/*
import { NextRequest } from 'next/server';
import { getAuthenticatedUser } from '@/shared/lib/api/auth';
import { withApiHandler } from '@/shared/lib/api/response';
import { SUCCESS_MESSAGES } from '@/shared/lib/api/constants';

export async function GET(request: NextRequest) {
  return withApiHandler(async () => {
    const { user, error } = await getAuthenticatedUser();
    if (error) {
      throw new Error('Unauthorized');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
    };
  }, SUCCESS_MESSAGES.USER_INFO_RETRIEVED);
}
*/

// UI 테스트용 임시 응답
export async function GET() {
  return new Response(JSON.stringify({
    success: false,
    message: 'User Me API is temporarily disabled for UI testing',
    data: null
  }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  });
}