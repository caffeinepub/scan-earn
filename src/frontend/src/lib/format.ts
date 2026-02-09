export function formatINR(amount: number): string {
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}k`;
  }
  return `₹${amount}`;
}

export function formatCoins(coins: number | bigint): string {
  const num = typeof coins === 'bigint' ? Number(coins) : coins;
  return num.toLocaleString('en-IN');
}

export function validatePhoneNumber(phone: string): boolean {
  // Indian phone number: 10 digits
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10;
}

export function normalizePhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}

