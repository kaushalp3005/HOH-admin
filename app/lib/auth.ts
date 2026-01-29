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

/**
 * Handle unauthorized (401) responses - clear auth and redirect to login
 * Call this when receiving a 401 response from the API
 */
export function handleUnauthorized(): void {
  clearAuth();
  if (typeof window !== 'undefined') {
    // Redirect to login page
    window.location.href = '/login';
  }
}

/**
 * Check if a response indicates an expired/invalid token
 * Returns true if the response is a 401 Unauthorized
 */
export function isUnauthorizedResponse(response: Response): boolean {
  return response.status === 401;
}

/**
 * Handle API response - auto logout on 401
 * Use this wrapper to automatically handle token expiration
 */
export async function handleApiResponse<T>(
  response: Response,
  errorMessage: string
): Promise<T> {
  if (isUnauthorizedResponse(response)) {
    handleUnauthorized();
    throw new Error('Session expired. Please log in again.');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const detail = error.detail;
    const errorMsg = Array.isArray(detail) ? detail[0]?.msg : detail;
    throw new Error(errorMsg || error.error || `${errorMessage}: ${response.statusText}`);
  }

  return response.json();
}

