// Presign API - UI 테스트를 위해 주석 처리
/*
import { NextRequest } from 'next/server';
import { getAuthenticatedUser } from '@/shared/lib/api/auth';
import { withApiHandler } from '@/shared/lib/api/response';
import { SUCCESS_MESSAGES } from '@/shared/lib/api/constants';
import { apiConfig } from '@/shared/lib/config/api';

const PRESIGN_API_ENDPOINT = apiConfig.presignApi;

if (!PRESIGN_API_ENDPOINT) {
  throw new Error('Presign API endpoint is not configured');
}

export async function POST(request: NextRequest) {
  return withApiHandler(async () => {
    const { user, error } = await getAuthenticatedUser();
    if (error) {
      throw new Error('Unauthorized');
    }

    const { fileName, contentType } = await request.json();

    if (!fileName || !contentType) {
      throw new Error('Bad Request: fileName and contentType are required');
    }

    const response = await fetch(PRESIGN_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.accessToken}`,
      },
      body: JSON.stringify({ fileName, contentType }),
    });

    if (!response.ok) {
      throw new Error(`Presign API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  }, SUCCESS_MESSAGES.PRESIGN_SUCCESS);
}
*/

// UI 테스트용 임시 응답
export async function POST() {
  return new Response(JSON.stringify({
    success: false,
    message: 'Presign API is temporarily disabled for UI testing',
    data: null
  }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  });
}