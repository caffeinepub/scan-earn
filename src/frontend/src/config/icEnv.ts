/**
 * Simplified Internet Computer environment configuration
 * Internal-only, no user-facing configuration
 */

interface ICConfig {
  backendCanisterId: string;
  host?: string;
  isLocal: boolean;
}

let cachedConfig: ICConfig | null = null;

export async function loadICConfig(): Promise<ICConfig> {
  if (cachedConfig) {
    return cachedConfig;
  }

  // Use hardcoded production configuration - internal only
  cachedConfig = {
    backendCanisterId: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
    host: 'https://ic0.app',
    isLocal: false,
  };

  return cachedConfig;
}

export function getICConfig(): ICConfig | null {
  return cachedConfig;
}

export const setICConfig = (config: ICConfig) => {
  cachedConfig = config;
};
