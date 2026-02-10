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

export function stripNonDigits(value: string): string {
  return value.replace(/\D/g, '');
}
