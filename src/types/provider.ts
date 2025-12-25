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
