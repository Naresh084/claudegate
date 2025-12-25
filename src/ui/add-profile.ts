import { select } from '@inquirer/prompts';
import chalk from 'chalk';
import { PROVIDERS, getProviderById } from '../providers/index.js';
import { createProfile, setActiveProfile } from '../services/profile.service.js';
import { hasFallbackModels } from '../services/model.service.js';
import { promptProfileName, promptEnvVars } from './profile-form.js';
import { selectModels } from './model-selector.js';
import { showSuccess } from './components/status.js';
import type { Profile, SelectedModels } from '../types/index.js';

/**
 * Flow for adding a new profile
 * Returns the created profile or null if cancelled
 */
export async function addProfileFlow(): Promise<Profile | null> {
  console.log();

  // 1. Select provider
  const providerId = await select({
    message: 'Select provider:',
    choices: PROVIDERS.map((p) => ({
      name: `${p.name}`,
      value: p.id,
      description: p.description,
    })),
  });

  const provider = getProviderById(providerId);
  if (!provider) return null;

  console.log();

  // 2. Enter profile name
  const name = await promptProfileName();

  // 3. Enter env vars (if any)
  let envVars: Record<string, string> = {};
  if (provider.envVars.length > 0) {
    console.log();
    console.log(chalk.dim(`  Configure ${provider.name}:`));
    console.log();
    envVars = await promptEnvVars(provider);
  }

  // 4. Model selection (if provider supports it)
  let selectedModels: SelectedModels | undefined;

  const supportsModels =
    provider.modelFetching?.supported || hasFallbackModels(providerId);

  if (supportsModels && !provider.useExistingConfig) {
    // Get API key from env vars
    const apiKeyEnvVar =
      provider.modelFetching?.authKeyEnvVar || 'ANTHROPIC_AUTH_TOKEN';
    const apiKey =
      envVars[apiKeyEnvVar] || envVars['OPENROUTER_API_KEY'] || '';

    if (apiKey) {
      console.log();
      console.log(chalk.cyan('  Model Selection:'));

      const models = await selectModels(provider, apiKey);
      if (models) {
        selectedModels = {
          haiku: models.haiku,
          sonnet: models.sonnet,
          opus: models.opus,
          lastFetched: new Date().toISOString(),
        };
      }
    }
  }

  // 5. Create the profile
  const profile = createProfile(name, providerId, envVars, selectedModels);

  // 6. Set as active
  setActiveProfile(profile.id);

  console.log();
  showSuccess(`Profile '${name}' created and set as active!`);

  return profile;
}
