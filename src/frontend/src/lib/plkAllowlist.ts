// PLK code allowlist - exactly 20 authorized codes
const AUTHORIZED_CODES = new Set([
  '482917',
  '705364',
  '193852',
  '640291',
  '958473',
  '271604',
  '834920',
  '506187',
  '719345',
  '462890',
  '395741',
  '870256',
  '124698',
  '953071',
  '687432',
  '240915',
  '531768',
  '906524',
  '378159',
  '654203',
]);

/**
 * Check if a 6-digit PLK code is authorized
 */
export function isAuthorizedPlk(code: string): boolean {
  return AUTHORIZED_CODES.has(code);
}
