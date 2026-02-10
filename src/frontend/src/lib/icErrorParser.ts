/**
 * Centralized IC/agent error parser
 * Converts unknown thrown values into structured, user-friendly error models
 */

export interface ParsedICError {
  title: string;
  message: string;
  details?: {
    requestId?: string;
    rejectCode?: number;
    errorCode?: string;
    rawMessage?: string;
  };
  isBackendUnavailable: boolean;
  isCanisterStopped: boolean;
  isOutOfCycles: boolean;
  isApiMismatch: boolean;
  isAuthError: boolean;
  isInvalidCanisterId: boolean;
}

/**
 * Check if error indicates backend/canister is unavailable
 */
export function isBackendUnavailable(error: ParsedICError): boolean {
  return error.isBackendUnavailable || error.isCanisterStopped || error.isOutOfCycles;
}

/**
 * Check if error indicates API version mismatch (method not found, candid mismatch)
 */
export function isApiMismatch(error: ParsedICError): boolean {
  return error.isApiMismatch;
}

/**
 * Check if error is authentication-related
 */
export function isAuthError(error: ParsedICError): boolean {
  return error.isAuthError;
}

/**
 * Check if error is invalid canister ID
 */
export function isInvalidCanisterId(error: ParsedICError): boolean {
  return error.isInvalidCanisterId;
}

/**
 * Parse any error into a user-friendly structure
 */
export function parseICError(error: unknown): ParsedICError {
  // Default error structure
  const parsed: ParsedICError = {
    title: 'Operation Failed',
    message: 'An unexpected error occurred. Please try again.',
    isBackendUnavailable: false,
    isCanisterStopped: false,
    isOutOfCycles: false,
    isApiMismatch: false,
    isAuthError: false,
    isInvalidCanisterId: false,
  };

  // Handle null/undefined
  if (!error) {
    return parsed;
  }

  // Extract error message
  let errorMessage = '';
  let errorObject: any = error;

  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (typeof error === 'object' && 'message' in error) {
    errorMessage = String((error as any).message);
    errorObject = error;
  } else {
    errorMessage = String(error);
  }

  // Extract technical details if available
  const details: ParsedICError['details'] = {};
  
  // Try to extract requestId
  const requestIdMatch = errorMessage.match(/Request ID:\s*([a-f0-9-]+)/i) ||
                        errorMessage.match(/request[_-]?id["\s:]+([a-f0-9-]+)/i);
  if (requestIdMatch) {
    details.requestId = requestIdMatch[1];
  }

  // Try to extract reject code
  const rejectCodeMatch = errorMessage.match(/Reject code:\s*(\d+)/i) ||
                         errorMessage.match(/reject[_-]?code["\s:]+(\d+)/i);
  if (rejectCodeMatch) {
    details.rejectCode = parseInt(rejectCodeMatch[1], 10);
  }

  // Try to extract error code
  const errorCodeMatch = errorMessage.match(/Error code:\s*([A-Z_]+)/i) ||
                        errorMessage.match(/error[_-]?code["\s:]+([A-Z_]+)/i);
  if (errorCodeMatch) {
    details.errorCode = errorCodeMatch[1];
  }

  // Store raw message
  details.rawMessage = errorMessage;

  // Assign details
  parsed.details = details;

  const lowerMessage = errorMessage.toLowerCase();

  // Check for invalid canister ID errors (highest priority)
  if (
    lowerMessage.includes('invalid canister id') ||
    lowerMessage.includes('invalid canister-id') ||
    lowerMessage.includes('malformed principal') ||
    lowerMessage.includes('invalid principal') ||
    lowerMessage.includes('could not parse principal') ||
    lowerMessage.includes('text not valid') ||
    (lowerMessage.includes('principal') && lowerMessage.includes('invalid'))
  ) {
    parsed.isInvalidCanisterId = true;
    parsed.title = 'Invalid Canister ID';
    parsed.message = 'The backend canister ID is invalid or not configured. Please open Connection Settings to enter a valid deployed canister ID and verify the IC host is correct (usually https://ic0.app).';
    return parsed;
  }

  // Check for out of cycles / insufficient cycles
  if (
    lowerMessage.includes('out of cycles') ||
    lowerMessage.includes('insufficient cycles') ||
    lowerMessage.includes('canister has run out of cycles') ||
    (lowerMessage.includes('cycles') && (lowerMessage.includes('insufficient') || lowerMessage.includes('out of')))
  ) {
    parsed.isOutOfCycles = true;
    parsed.isCanisterStopped = true;
    parsed.title = 'Backend Canister Out of Cycles';
    parsed.message = 'The backend canister has run out of cycles and is stopped. To fix this: (1) Redeploy or restart the backend canister, (2) Verify it is Running in dfx canister status, (3) Top up cycles if needed, and (4) Ensure frontend/public/ic-config.json has the correct backendCanisterId.';
    return parsed;
  }

  // Check for canister stopped
  if (
    lowerMessage.includes('canister') && lowerMessage.includes('stopped') ||
    lowerMessage.includes('canister') && lowerMessage.includes('stopping') ||
    lowerMessage.includes('canister is not running')
  ) {
    parsed.isCanisterStopped = true;
    parsed.title = 'Backend Canister Stopped';
    parsed.message = 'The backend canister is stopped or unreachable. To fix this: (1) Redeploy or restart the backend canister using dfx deploy, (2) Verify it is Running with dfx canister status, (3) Ensure frontend/public/ic-config.json has the correct backendCanisterId, and (4) Rebuild/redeploy the frontend if needed.';
    return parsed;
  }

  // Check for general backend unavailability
  if (
    lowerMessage.includes('fetch') && lowerMessage.includes('failed') ||
    lowerMessage.includes('network') && lowerMessage.includes('error') ||
    lowerMessage.includes('could not reach') ||
    lowerMessage.includes('connection') && lowerMessage.includes('refused') ||
    lowerMessage.includes('timeout') ||
    lowerMessage.includes('unreachable') ||
    lowerMessage.includes('not available') ||
    lowerMessage.includes('service unavailable')
  ) {
    parsed.isBackendUnavailable = true;
    parsed.title = 'Backend Canister Unreachable';
    parsed.message = 'Unable to connect to the backend canister. Check your Connection Settings to verify the canister ID and IC host are correct, or reset to defaults. If the canister is stopped, redeploy it and ensure it is Running.';
    return parsed;
  }

  // Check for API mismatch
  if (
    lowerMessage.includes('method not found') ||
    lowerMessage.includes('function not found') ||
    lowerMessage.includes('candid') && lowerMessage.includes('mismatch') ||
    lowerMessage.includes('interface') && lowerMessage.includes('mismatch')
  ) {
    parsed.isApiMismatch = true;
    parsed.title = 'API Version Mismatch';
    parsed.message = 'The frontend and backend versions are incompatible. Please ensure both are up to date and re-sync the bindings.';
    return parsed;
  }

  // Check for authentication errors
  if (
    lowerMessage.includes('unauthorized') ||
    lowerMessage.includes('authentication') && lowerMessage.includes('failed') ||
    lowerMessage.includes('not authenticated') ||
    lowerMessage.includes('permission denied')
  ) {
    parsed.isAuthError = true;
    parsed.title = 'Authentication Required';
    parsed.message = 'You need to be signed in to perform this action. Please sign in and try again.';
    return parsed;
  }

  // Return generic error with details
  return parsed;
}
