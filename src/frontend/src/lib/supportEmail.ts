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
 * Opens Gmail compose in a new window/tab with fallback to mailto.
 */
export function openSupportEmail(email: string = '99999diamonds@gmail.com'): void {
  const subject = 'Face Verification Issue';
  const body = 'Hello, I was blocked during face verification. Please help.';
  
  const gmailUrl = buildGmailComposeUrl(email, subject, body);
  const mailtoUrl = buildMailtoUrl(email, subject, body);
  
  // Try Gmail first
  const newWindow = window.open(gmailUrl, '_blank');
  
  // Fallback to mailto if popup blocked
  if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
    window.location.href = mailtoUrl;
  }
}
