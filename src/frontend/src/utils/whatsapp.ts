/**
 * Build a WhatsApp deep link with a prefilled message
 * @param phoneNumber - Phone number in international format (e.g., 919541525891)
 * @param message - Message to prefill
 * @returns WhatsApp deep link URL
 */
export function buildWhatsAppLink(phoneNumber: string, message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

/**
 * Get the WhatsApp link for NFC code request
 * @returns WhatsApp deep link with prefilled message
 */
export function getWhatsAppNFCLink(): string {
  const phoneNumber = '919541525891';
  const message = `Get NFC code of 4 digits

Code works only: CTTH

Only per CTR Registered user`;
  
  return buildWhatsAppLink(phoneNumber, message);
}
