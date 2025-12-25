/**
 * @module Environment Builder Service
 * @description Builds environment variables for Claude CLI based on profile configuration.
 *
 * This service is responsible for:
 * - Applying provider default values
 * - Merging profile-specific overrides
 * - Clearing conflicting environment variables (e.g., ANTHROPIC_API_KEY)
 *
 * @example
 * // Build env vars for a profile
 * const envVars = buildEnvVars(profile);
 * // { ANTHROPIC_BASE_URL: 'https://...', ANTHROPIC_AUTH_TOKEN: '...' }
 *
 * // Merge with process environment
 * const fullEnv = mergeEnv(envVars);
 * // Contains both system env and profile env
 */

import type { Profile } from '../types/index.js';
import { getProviderById } from '../providers/index.js';

/**
 * Build environment variables from a profile
 * Returns empty object for Anthropic (useExistingConfig) profiles
 * For other providers, clears ANTHROPIC_API_KEY to force using the custom endpoint
 */
export function buildEnvVars(profile: Profile): Record<string, string> {
  const provider = getProviderById(profile.providerId);

  // For Anthropic native, don't set any env vars - use existing config
  if (provider?.useExistingConfig) {
    return {};
  }

  const env: Record<string, string> = {};

  // IMPORTANT: Clear ANTHROPIC_API_KEY to force Claude to use custom endpoint
  // Otherwise it will use the native Anthropic API even with ANTHROPIC_BASE_URL set
  env['ANTHROPIC_API_KEY'] = '';

  // First, apply provider defaults
  if (provider) {
    for (const spec of provider.envVars) {
      if (spec.default !== undefined) {
        env[spec.name] = String(spec.default);
      }
    }
  }

  // Then override with profile-specific values
  for (const [key, value] of Object.entries(profile.envVars)) {
    if (value !== undefined && value !== null && value !== '') {
      env[key] = String(value);
    }
  }

  return env;
}

/**
 * Merge profile env vars with process env
 * Profile env vars take precedence
 */
export function mergeEnv(
  profileEnv: Record<string, string>
): NodeJS.ProcessEnv {
  return {
    ...process.env,
    ...profileEnv,
  };
}
