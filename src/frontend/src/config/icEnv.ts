/**
 * Internet Computer environment configuration
 * Determines network mode and provides correct canister IDs for deployed environments
 */

interface ICConfig {
  backendCanisterId: string;
  host?: string;
  isLocal: boolean;
}

/**
 * Load IC configuration from runtime or build-time sources
 */
export async function loadICConfig(): Promise<ICConfig> {
  // Check if we're in local development
  const isLocal = process.env.DFX_NETWORK !== 'ic' && 
                  process.env.NODE_ENV !== 'production';

  // Try to load from public config file (for deployed environments)
  if (!isLocal) {
    try {
      const response = await fetch('/ic-config.json');
      if (response.ok) {
        const config = await response.json();
        return {
          backendCanisterId: config.backendCanisterId,
          host: config.host || 'https://ic0.app',
          isLocal: false,
        };
      }
    } catch (error) {
      console.warn('Failed to load ic-config.json, falling back to env variables');
    }
  }

  // Fallback to environment variables or local defaults
  const backendCanisterId = process.env.CANISTER_ID_BACKEND || 
                           process.env.BACKEND_CANISTER_ID ||
                           'rrkah-fqaaa-aaaaa-aaaaq-cai'; // Local default

  return {
    backendCanisterId,
    host: isLocal ? 'http://localhost:4943' : 'https://ic0.app',
    isLocal,
  };
}

/**
 * Get the current IC configuration synchronously (for use after initialization)
 */
let cachedConfig: ICConfig | null = null;

export function getICConfig(): ICConfig {
  if (!cachedConfig) {
    throw new Error('IC config not initialized. Call loadICConfig() first.');
  }
  return cachedConfig;
}

export function setICConfig(config: ICConfig): void {
  cachedConfig = config;
}
