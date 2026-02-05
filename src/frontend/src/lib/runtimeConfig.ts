/**
 * Runtime configuration resolver for backend canister ID.
 * Implements a robust fallback chain that doesn't hard-fail on /env.json unavailability.
 */

interface RuntimeConfig {
  backendCanisterId: string | null;
  source: 'build-time' | 'window' | 'env-json' | 'session-cache' | 'none';
  configLoadAttempted: boolean;
  configLoadFailed: boolean;
}

let cachedConfig: RuntimeConfig | null = null;

/**
 * Attempts to load env.json with timeout and graceful failure handling
 */
async function tryLoadEnvJson(timeoutMs: number = 3000): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch('/env.json', {
      signal: controller.signal,
      cache: 'no-cache',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[RuntimeConfig] /env.json returned ${response.status}, skipping`);
      return null;
    }

    const data = await response.json();
    return data.CANISTER_ID_BACKEND || data.canisterId || null;
  } catch (error) {
    // Non-fatal: log and continue with other fallbacks
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn('[RuntimeConfig] /env.json fetch timed out, using fallbacks');
    } else {
      console.warn('[RuntimeConfig] Failed to load /env.json:', error);
    }
    return null;
  }
}

/**
 * Resolves the backend canister ID through a robust fallback chain.
 * Priority: build-time env → window global → session cache → env.json → none
 */
export async function resolveBackendCanisterId(): Promise<RuntimeConfig> {
  // Return cached result if available
  if (cachedConfig) {
    return cachedConfig;
  }

  let backendCanisterId: string | null = null;
  let source: RuntimeConfig['source'] = 'none';
  let configLoadAttempted = false;
  let configLoadFailed = false;

  // 1. Try build-time environment variables (highest priority)
  const buildTimeId =
    import.meta.env.VITE_CANISTER_ID_BACKEND ||
    import.meta.env.CANISTER_ID_BACKEND ||
    null;

  if (buildTimeId) {
    backendCanisterId = buildTimeId;
    source = 'build-time';
  }

  // 2. Try window global (injected by hosting environment)
  if (!backendCanisterId) {
    const windowId = (window as any).CANISTER_ID_BACKEND || null;
    if (windowId) {
      backendCanisterId = windowId;
      source = 'window';
    }
  }

  // 3. Try session storage cache (from previous successful load)
  if (!backendCanisterId) {
    try {
      const cached = sessionStorage.getItem('CANISTER_ID_BACKEND');
      if (cached) {
        backendCanisterId = cached;
        source = 'session-cache';
      }
    } catch (e) {
      // Session storage might not be available
    }
  }

  // 4. Try loading from /env.json (lowest priority, non-blocking)
  if (!backendCanisterId) {
    configLoadAttempted = true;
    const envJsonId = await tryLoadEnvJson();
    if (envJsonId) {
      backendCanisterId = envJsonId;
      source = 'env-json';
      // Cache successful load
      try {
        sessionStorage.setItem('CANISTER_ID_BACKEND', envJsonId);
      } catch (e) {
        // Ignore storage errors
      }
    } else {
      configLoadFailed = true;
    }
  }

  const config: RuntimeConfig = {
    backendCanisterId,
    source,
    configLoadAttempted,
    configLoadFailed,
  };

  // Cache the result
  cachedConfig = config;

  if (backendCanisterId) {
    console.log(`[RuntimeConfig] Backend canister ID resolved from ${source}: ${backendCanisterId}`);
  } else {
    console.error('[RuntimeConfig] Failed to resolve backend canister ID from any source');
  }

  return config;
}

/**
 * Synchronous version that returns cached value or null.
 * Use this after the async version has been called at least once.
 */
export function getBackendCanisterIdSync(): string | null {
  if (cachedConfig) {
    return cachedConfig.backendCanisterId;
  }

  // Try immediate sources only (no async fetch)
  const buildTimeId =
    import.meta.env.VITE_CANISTER_ID_BACKEND ||
    import.meta.env.CANISTER_ID_BACKEND ||
    null;

  if (buildTimeId) {
    return buildTimeId;
  }

  const windowId = (window as any).CANISTER_ID_BACKEND || null;
  if (windowId) {
    return windowId;
  }

  try {
    const cached = sessionStorage.getItem('CANISTER_ID_BACKEND');
    if (cached) {
      return cached;
    }
  } catch (e) {
    // Ignore
  }

  return null;
}

/**
 * Get diagnostic information about the configuration resolution
 */
export function getConfigDiagnostics(): RuntimeConfig {
  return cachedConfig || {
    backendCanisterId: null,
    source: 'none',
    configLoadAttempted: false,
    configLoadFailed: false,
  };
}

/**
 * Clear the cached configuration (useful for testing or forcing reload)
 */
export function clearConfigCache(): void {
  cachedConfig = null;
  try {
    sessionStorage.removeItem('CANISTER_ID_BACKEND');
  } catch (e) {
    // Ignore
  }
}
