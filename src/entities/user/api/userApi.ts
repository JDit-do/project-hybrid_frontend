import { User, UserSession } from '../model/types';

export class UserApi {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${this.baseUrl}/api/user/me`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    
    return response.json();
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const response = await fetch(`${this.baseUrl}/api/user/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to update user');
    }
    
    return response.json();
  }

  async deleteUser(userId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/user/${userId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
  }
}

export const userApi = new UserApi();
