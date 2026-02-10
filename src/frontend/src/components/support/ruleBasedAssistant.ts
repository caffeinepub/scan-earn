/**
 * Local rule-based assistant for customer support
 * Matches user intents to canned responses without external AI calls
 */

interface Intent {
  keywords: string[];
  response: string;
}

const intents: Intent[] = [
  // Payment not received / Add funds not received
  {
    keywords: [
      'payment not received',
      'add funds not received',
      'money not received',
      'funds not showing',
      'coins not added',
      'transaction not reflected',
      'payment pending',
      'not credited',
    ],
    response: 'Kindly wait for 2 hours while we confirm your payment.',
  },
  // Withdrawal not received
  {
    keywords: [
      'withdrawal not received',
      'withdraw not received',
      'withdrawal pending',
      'money not withdrawn',
      'withdrawal not processed',
    ],
    response: 'Kindly wait for 2 hours while we confirm your payment.',
  },
  // How to login / sign in
  {
    keywords: [
      'how to login',
      'how do i login',
      'login help',
      'cannot login',
      'login issue',
      'sign in',
      'how to sign in',
      'google login',
      'microsoft login',
    ],
    response:
      'To sign in:\n1. Go to the "Sign in / Connection" section from the menu\n2. Click "Continue with Google" or "Continue with Microsoft"\n3. Follow the authentication steps in the dialog\n4. Once signed in, you can connect your CTR ID',
  },
  // How to connect CTR
  {
    keywords: [
      'how to connect ctr',
      'connect ctr',
      'ctr connection',
      'register ctr',
      'ctr id',
      'access code',
    ],
    response:
      'To connect your CTR:\n1. Sign in first\n2. Enter the shared CTR ID: 0918611\n3. Enter the shared access code: 95415 or 0918611\n4. Click "Connect CTR"\n\nNote: These are shared credentials for all users.',
  },
  // How to add funds
  {
    keywords: [
      'how to add funds',
      'add money',
      'buy coins',
      'purchase coins',
      'how to pay',
      'payment method',
    ],
    response:
      'To add funds:\n1. Go to "Stocks & Add Funds" from the menu\n2. Select a coin package\n3. Pay using the QR code or UPI apps\n4. Enter your transaction ID\n5. Click "Confirm Payment"\n\nYour coins will be added after confirmation.',
  },
  // How to withdraw
  {
    keywords: [
      'how to withdraw',
      'withdraw money',
      'cash out',
      'withdrawal process',
      'get money',
    ],
    response:
      'To withdraw:\n1. Go to "Withdrawal" from the menu\n2. Enter the amount you want to withdraw\n3. Click "Request Withdrawal"\n\nNote: You must have sufficient balance. Withdrawals are processed within 2 hours.',
  },
  // Balance inquiry
  {
    keywords: ['balance', 'how many coins', 'check balance', 'my coins'],
    response:
      'You can check your coin balance in the "Stocks & Add Funds" section. Your current balance is displayed at the top of the page.',
  },
  // Transaction history
  {
    keywords: [
      'transaction history',
      'my transactions',
      'payment history',
      'withdrawal history',
      'past transactions',
    ],
    response:
      'You can view your transaction history:\n- Add Funds History: In the "Stocks & Add Funds" section\n- Withdrawal History: In the "Withdrawal" section\n\nBoth sections show all your past transactions.',
  },
  // General greeting
  {
    keywords: ['hello', 'hi', 'hey', 'greetings'],
    response:
      'Hello! How can I help you today? I can assist with:\n- Sign in and CTR connection\n- Adding funds\n- Withdrawals\n- Transaction history\n- General questions',
  },
  // Thank you
  {
    keywords: ['thank', 'thanks', 'appreciate'],
    response: 'You\'re welcome! If you have any other questions, feel free to ask.',
  },
];

/**
 * Get assistant response based on user message
 */
export function getAssistantResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  // Find matching intent
  for (const intent of intents) {
    for (const keyword of intent.keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        return intent.response;
      }
    }
  }

  // Default response if no match
  return 'I\'m here to help! I can assist you with:\n\n- Sign in and CTR connection\n- Adding funds and payment issues\n- Withdrawals\n- Transaction history\n- Account balance\n\nPlease let me know what you need help with.';
}
