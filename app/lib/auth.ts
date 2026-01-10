'use client';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_ID_KEY = 'user_id';

export function setAuth(userId: string, token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(USER_ID_KEY, userId);
  }
}

export function getAuth(): { userId: string; token: string } | null {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const userId = localStorage.getItem(USER_ID_KEY);
    if (token && userId) {
      return { userId, token };
    }
  }
  return null;
}

export function clearAuth() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
  }
}

export function isAuthenticated(): boolean {
  return getAuth() !== null;
}

