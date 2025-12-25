/**
 * @module Provider Types
 * @description Type definitions for AI provider configurations.
 *
 * The provider system allows ClaudeGate to support multiple AI backends.
 * Each provider defines:
 * - Required/optional environment variables
 * - Default values for configuration
 * - Display metadata (name, description, color)
 *
 * @example
 * // Provider definition structure
 * const provider: ProviderDefinition = {
 *   id: 'my-provider',
 *   name: 'My Provider',
 *   description: 'Custom AI provider',
 *   color: '#FF0000',
 *   envVars: [
 *     { name: 'API_KEY', label: 'API Key', type: 'apiKey', sensitive: true, required: true }
 *   ]
 * };
 */

/**
 * Specification for an environment variable required/optional for a provider
 */
export interface EnvVarSpec {
  name: string;
  label: string;
  description: string;
  type: 'apiKey' | 'url' | 'string' | 'number';
  sensitive: boolean;
  default?: string | number;
  required: boolean;
}

/**
 * Definition of a supported AI provider
 */
export interface ProviderDefinition {
  id: string;
  name: string;
  description: string;
  color: string;
  envVars: EnvVarSpec[];
  // If true, don't set any env vars - use user's existing config
  useExistingConfig?: boolean;
}
