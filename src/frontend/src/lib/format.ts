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

export function validateCtrId(ctrId: string): { valid: boolean; error?: string } {
  // Check length - must be exactly 7 digits
  if (ctrId.length !== 7) {
    return { valid: false, error: 'CTR ID must be exactly 7 digits' };
  }

  // Check if all characters are digits
  if (!/^\d{7}$/.test(ctrId)) {
    return { valid: false, error: 'CTR ID must contain only digits' };
  }

  return { valid: true };
}
