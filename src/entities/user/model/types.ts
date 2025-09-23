export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
  user: User;
  accessToken: string;
  idToken: string;
  expiresAt: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
}
