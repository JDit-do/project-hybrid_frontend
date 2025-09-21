// User ID API - UI 테스트를 위해 주석 처리
/*
import { NextRequest } from 'next/server';
import { getAuthenticatedUser } from '@/shared/lib/api/auth';
import { withApiHandler } from '@/shared/lib/api/response';
import { SUCCESS_MESSAGES } from '@/shared/lib/api/constants';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withApiHandler(async () => {
    const { user, error } = await getAuthenticatedUser();
    if (error) {
      throw new Error('Unauthorized');
    }

    const { id } = await params;
    const updates = await request.json();

    // 권한 확인: 사용자는 자신의 정보만 수정할 수 있음
    if (user.id !== id && user.email !== id) {
      throw new Error('Forbidden: You can only update your own information');
    }

    // TODO: 실제 사용자 업데이트 로직 구현
    const updatedUser = {
      id,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return updatedUser;
  }, SUCCESS_MESSAGES.USER_UPDATED);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withApiHandler(async () => {
    const { user, error } = await getAuthenticatedUser();
    if (error) {
      throw new Error('Unauthorized');
    }

    const { id } = await params;

    // 권한 확인: 사용자는 자신의 정보만 삭제할 수 있음
    if (user.id !== id && user.email !== id) {
      throw new Error('Forbidden: You can only delete your own information');
    }

    // TODO: 실제 사용자 삭제 로직 구현
    return { message: 'User deleted successfully', id };
  }, SUCCESS_MESSAGES.USER_DELETED);
}
*/

// UI 테스트용 임시 응답
export async function PATCH() {
  return new Response(JSON.stringify({
    success: false,
    message: 'User ID API is temporarily disabled for UI testing',
    data: null
  }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function DELETE() {
  return new Response(JSON.stringify({
    success: false,
    message: 'User ID API is temporarily disabled for UI testing',
    data: null
  }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  });
}