/**
 * Generates a random session user ID using browser-safe cryptographic randomness.
 * Format: USER-XXXXXXXX (8 uppercase alphanumeric characters)
 */
export function generateSessionUserId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const array = new Uint8Array(8);
  crypto.getRandomValues(array);
  
  const randomChars = Array.from(array)
    .map(byte => chars[byte % chars.length])
    .join('');
  
  return `USER-${randomChars}`;
}
