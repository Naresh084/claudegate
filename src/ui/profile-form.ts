import { input, password } from '@inquirer/prompts';
import type { ProviderDefinition, EnvVarSpec } from '../types/index.js';

/**
 * Prompt for a profile name
 */
export async function promptProfileName(defaultName?: string): Promise<string> {
  return input({
    message: 'Profile name:',
    default: defaultName,
    validate: (value) => {
      if (!value.trim()) return 'Profile name is required';
      if (value.length > 50) return 'Profile name must be 50 characters or less';
      return true;
    },
  });
}

/**
 * Prompt for all env vars defined by a provider
 */
export async function promptEnvVars(
  provider: ProviderDefinition,
  existingVars?: Record<string, string>
): Promise<Record<string, string>> {
  const envVars: Record<string, string> = {};

  for (const spec of provider.envVars) {
    const value = await promptEnvVar(spec, existingVars?.[spec.name]);
    if (value !== undefined && value !== '') {
      envVars[spec.name] = value;
    }
  }

  return envVars;
}

/**
 * Prompt for a single env var
 */
async function promptEnvVar(
  spec: EnvVarSpec,
  existingValue?: string
): Promise<string> {
  const defaultValue = existingValue ?? spec.default?.toString();
  const requiredSuffix = spec.required ? '' : ' (optional)';
  const message = `${spec.label}${requiredSuffix}:`;

  if (spec.sensitive) {
    return password({
      message,
      mask: '*',
      validate: (value) => {
        if (spec.required && !value.trim()) {
          return `${spec.label} is required`;
        }
        return true;
      },
    });
  }

  return input({
    message,
    default: defaultValue,
    validate: (value) => {
      if (spec.required && !value.trim()) {
        return `${spec.label} is required`;
      }
      return true;
    },
  });
}
