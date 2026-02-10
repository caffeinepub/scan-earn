/**
 * Builds a Gmail compose URL with pre-filled recipient, subject, and body.
 */
export function buildGmailComposeUrl(
  to: string,
  subject: string = '',
  body: string = ''
): string {
  const params = new URLSearchParams({
    to,
    su: subject,
    body,
  });
  return `https://mail.google.com/mail/?view=cm&fs=1&${params.toString()}`;
}

/**
 * Builds a mailto fallback URL.
 */
export function buildMailtoUrl(
  to: string,
  subject: string = '',
  body: string = ''
): string {
  const params = new URLSearchParams({
    subject,
    body,
  });
  return `mailto:${to}?${params.toString()}`;
}

/**
 * Opens customer care email (99999diamomds@gmail.com) in Gmail compose with fallback to mailto.
 */
export function openCustomerCareEmail(): void {
  const email = '99999diamomds@gmail.com';
  const subject = 'Customer Support Request';
  const body = 'Hello, I need assistance with...';
  
  const gmailUrl = buildGmailComposeUrl(email, subject, body);
  const mailtoUrl = buildMailtoUrl(email, subject, body);
  
  // Try Gmail first
  const newWindow = window.open(gmailUrl, '_blank');
  
  // Fallback to mailto if popup blocked
  if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
    window.location.href = mailtoUrl;
  }
}
