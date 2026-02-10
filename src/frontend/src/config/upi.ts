// UPI payment configuration and helper functions

export const UPI_CONFIG = {
  id: 'turbohacker4-2@okhdfcbank',
  payeeName: 'Iqlas Dar',
};

/**
 * Builds a UPI payment intent URL
 * @param amount - Amount in INR
 * @returns UPI deep link URL
 */
export function buildUpiUrl(amount: number): string {
  const { id, payeeName } = UPI_CONFIG;
  return `upi://pay?pa=${id}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`;
}
