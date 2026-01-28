import { select, confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import {
  getAllProfiles,
  deleteProfile,
  updateProfile,
  getActiveProfile,
} from '../services/profile.service.js';
import { getProviderById } from '../providers/index.js';
import { hasFallbackModels } from '../services/model.service.js';
import { promptProfileName, promptEnvVars } from './profile-form.js';
import { selectModels } from './model-selector.js';
import { showSuccess, showError, showInfo } from './components/status.js';
import type { Profile, SelectedModels } from '../types/index.js';

type ManageAction = 'edit' | 'change-models' | 'delete' | 'test' | 'back';

/**
 * Manage profiles submenu
 * Returns true if user wants to go back to main selector
 */
export async function manageProfilesFlow(): Promise<boolean> {
  const profiles = getAllProfiles();

  if (profiles.length === 0) {
    console.log();
    showInfo('No profiles to manage. Add a profile first.');
    return true;
  }

  console.log();

  // 1. Select profile to manage
  const profileId = await select({
    message: 'Select profile to manage:',
    choices: [
      ...profiles.map((p) => {
        const provider = getProviderById(p.providerId);
        return {
          name: `${p.name} (${provider?.name ?? p.providerId})`,
          value: p.id,
        };
      }),
      { name: chalk.dim('← Back'), value: '__back__' },
    ],
  });

  if (profileId === '__back__') return true;

  const profile = profiles.find((p) => p.id === profileId);
  if (!profile) return true;

  console.log();

  // Check if provider supports model selection
  const provider = getProviderById(profile.providerId);
  const supportsModels =
    provider &&
    !provider.useExistingConfig &&
    (provider.modelFetching?.supported || hasFallbackModels(profile.providerId));

  // 2. Select action
  const choices: Array<{ name: string; value: ManageAction | 'back' }> = [
    { name: 'Edit - Modify settings', value: 'edit' },
  ];

  if (supportsModels) {
    choices.push({
      name: 'Change Models - Select different models',
      value: 'change-models',
    });
  }

  choices.push(
    { name: 'Delete - Remove this profile', value: 'delete' },
    { name: 'Test - Verify connection works', value: 'test' },
    { name: chalk.dim('← Back'), value: 'back' }
  );

  const action = await select<ManageAction | 'back'>({
    message: `Action for '${profile.name}':`,
    choices,
  });

  if (action === 'back') return true;

  switch (action) {
    case 'edit':
      await editProfile(profile);
      break;
    case 'change-models':
      await changeModelsFlow(profile);
      break;
    case 'delete':
      await deleteProfileFlow(profile);
      break;
    case 'test':
      await testProfile(profile);
      break;
  }

  return true;
}

/**
 * Edit a profile
 */
async function editProfile(profile: Profile): Promise<void> {
  const provider = getProviderById(profile.providerId);
  if (!provider) {
    showError('Unknown provider');
    return;
  }

  console.log();

  // Edit name
  const name = await promptProfileName(profile.name);

  // Edit env vars (if provider has any)
  let envVars = profile.envVars;
  if (provider.envVars.length > 0) {
    console.log();
    console.log(chalk.dim('  Leave blank to keep existing value'));
    console.log();

    const newVars = await promptEnvVars(provider, profile.envVars);

    // Merge: new values override, but keep existing if new is empty
    envVars = { ...profile.envVars };
    for (const [key, value] of Object.entries(newVars)) {
      if (value) envVars[key] = value;
    }
  }

  updateProfile(profile.id, { name, envVars });
  console.log();
  showSuccess(`Profile '${name}' updated!`);
}

/**
 * Delete a profile with confirmation
 */
async function deleteProfileFlow(profile: Profile): Promise<void> {
  console.log();

  const activeProfile = getActiveProfile();
  const isActive = activeProfile?.id === profile.id;

  if (isActive) {
    showInfo('This is your active profile.');
  }

  const confirmed = await confirm({
    message: `Delete profile '${profile.name}'?`,
    default: false,
  });

  if (!confirmed) {
    showInfo('Cancelled');
    return;
  }

  deleteProfile(profile.id);
  console.log();
  showSuccess(`Profile '${profile.name}' deleted!`);
}

/**
 * Change models for a profile
 */
async function changeModelsFlow(profile: Profile): Promise<void> {
  const provider = getProviderById(profile.providerId);
  if (!provider) {
    showError('Unknown provider');
    return;
  }

  // Get API key from profile env vars
  const apiKeyEnvVar =
    provider.modelFetching?.authKeyEnvVar || 'ANTHROPIC_AUTH_TOKEN';
  const apiKey = profile.envVars[apiKeyEnvVar] || '';

  if (!apiKey) {
    showError('No API key configured for this profile');
    return;
  }

  console.log();
  console.log(chalk.cyan('  Model Selection:'));

  const models = await selectModels(provider, apiKey, profile.selectedModels);

  if (models) {
    const selectedModels: SelectedModels = {
      haiku: models.haiku,
      sonnet: models.sonnet,
      opus: models.opus,
      lastFetched: new Date().toISOString(),
    };

    updateProfile(profile.id, { selectedModels });
    console.log();
    showSuccess('Models updated!');
  }
}

/**
 * Test a profile connection
 */
async function testProfile(profile: Profile): Promise<void> {
  const provider = getProviderById(profile.providerId);

  console.log();
  showInfo(`Testing profile: ${profile.name}`);
  showInfo(`Provider: ${provider?.name ?? profile.providerId}`);

  // Show current models if set
  if (profile.selectedModels) {
    console.log();
    if (profile.selectedModels.haiku) {
      showInfo(`Haiku model: ${profile.selectedModels.haiku.name}`);
    }
    if (profile.selectedModels.sonnet) {
      showInfo(`Sonnet model: ${profile.selectedModels.sonnet.name}`);
    }
    if (profile.selectedModels.opus) {
      showInfo(`Opus model: ${profile.selectedModels.opus.name}`);
    }
  }

  console.log();

  // For now, just show a success message
  // In future, could actually ping the API endpoint
  if (provider?.useExistingConfig) {
    showSuccess('Uses your existing Claude CLI configuration');
  } else if (profile.envVars['ANTHROPIC_BASE_URL']) {
    showInfo(`Endpoint: ${profile.envVars['ANTHROPIC_BASE_URL']}`);
    showSuccess('Configuration looks valid');
  } else {
    showSuccess('Configuration looks valid');
  }
}
