const SESSION_KEY = 'plk_session_uid';

/**
 * Generate a random 8-digit numeric Unique ID
 */
export function generateUniqueId(): string {
  const min = 10000000;
  const max = 99999999;
  const randomId = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomId.toString();
}

/**
 * Store the session Unique ID in localStorage
 */
export function setSession(uniqueId: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, uniqueId);
  }
}

/**
 * Retrieve the session Unique ID from localStorage
 */
export function getSession(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SESSION_KEY);
}

/**
 * Validate that a session ID is exactly 8 digits
 */
export function isValidSession(sessionId: string | null): boolean {
  if (!sessionId) return false;
  return /^\d{8}$/.test(sessionId);
}

/**
 * Clear the session (logout)
 */
export function clearSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }
}

/**
 * Check if user has a valid session
 */
export function hasValidSession(): boolean {
  const sessionId = getSession();
  return isValidSession(sessionId);
}
