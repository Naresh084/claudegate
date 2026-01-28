import { select, input } from '@inquirer/prompts';
import chalk from 'chalk';
import ora from 'ora';
import {
  getModelsForProvider,
  getFallbackModelsForTier,
  type Model,
} from '../services/model.service.js';
import type { ProviderDefinition, SelectedModels, SelectedModel } from '../types/index.js';
import { showWarning, showError } from './components/status.js';

/**
 * Result of model selection
 */
export interface ModelSelection {
  haiku?: SelectedModel;
  sonnet?: SelectedModel;
  opus?: SelectedModel;
  default?: SelectedModel;
  subagent?: SelectedModel;
}

const SKIP_VALUE = '__skip__';
const CUSTOM_VALUE = '__custom__';

/**
 * Show model selection UI for all three tiers
 * Each tier is optional - user can skip to use defaults
 */
export async function selectModels(
  provider: ProviderDefinition,
  apiKey: string,
  currentModels?: SelectedModels
): Promise<ModelSelection | null> {
  // Fetch available models
  const spinner = ora('Fetching available models...').start();
  const result = await getModelsForProvider(provider, apiKey);
  spinner.stop();

  if (result.error) {
    // Show as error for server errors, warning for others
    if (result.error.includes('Server error') || result.error.includes('Fetch failed')) {
      showError(result.error);
    } else {
      showWarning(result.error);
    }
  }

  const models = result.models;

  if (models.length === 0 && !result.error) {
    showWarning('No models available. You can enter custom model IDs.');
  } else if (models.length === 0 && result.error) {
    showWarning('Using fallback models due to API error.');
  }

  console.log();
  console.log(chalk.dim('  Select models for each tier (or skip to use defaults):'));
  console.log();

  // Select Haiku model
  const haiku = await selectModelForTier(
    'haiku',
    'HAIKU (fast/cheap tasks)',
    models,
    getFallbackModelsForTier(provider.id, 'haiku'),
    currentModels?.haiku
  );

  // Select Sonnet model
  const sonnet = await selectModelForTier(
    'sonnet',
    'SONNET (balanced tasks)',
    models,
    getFallbackModelsForTier(provider.id, 'sonnet'),
    currentModels?.sonnet
  );

  // Select Opus model
  const opus = await selectModelForTier(
    'opus',
    'OPUS (complex reasoning)',
    models,
    getFallbackModelsForTier(provider.id, 'opus'),
    currentModels?.opus
  );

  // Select Default model (ANTHROPIC_MODEL)
  const defaultModel = await selectModelForTier(
    'sonnet',
    'DEFAULT (ANTHROPIC_MODEL)',
    models,
    getFallbackModelsForTier(provider.id, 'sonnet'),
    currentModels?.default
  );

  // Select Subagent model (CLAUDE_CODE_SUBAGENT_MODEL)
  const subagent = await selectModelForTier(
    'haiku',
    'SUBAGENT (fast tasks)',
    models,
    getFallbackModelsForTier(provider.id, 'haiku'),
    currentModels?.subagent
  );

  return { haiku, sonnet, opus, default: defaultModel, subagent };
}

/**
 * Select a model for a specific tier
 */
async function selectModelForTier(
  tier: 'haiku' | 'sonnet' | 'opus',
  tierLabel: string,
  allModels: Model[],
  tierFallbacks: Model[],
  currentModel?: SelectedModel
): Promise<SelectedModel | undefined> {
  // Build choices list
  const choices: Array<{ name: string; value: string; description?: string }> = [];

  // Add skip option
  choices.push({
    name: chalk.dim('Skip (use provider default)'),
    value: SKIP_VALUE,
    description: currentModel
      ? `Current: ${currentModel.name}`
      : 'Will use provider default model',
  });

  // Add current model if set and not in list
  if (currentModel && !allModels.find((m) => m.id === currentModel.id)) {
    choices.push({
      name: `${currentModel.name} (current)`,
      value: currentModel.id,
    });
  }

  // Add tier-specific fallbacks first (recommended)
  const fallbackIds = new Set(tierFallbacks.map((m) => m.id));
  for (const model of tierFallbacks) {
    if (!choices.find((c) => c.value === model.id)) {
      choices.push({
        name: `${model.name} (Recommended)`,
        value: model.id,
      });
    }
  }

  // Add other models from API
  for (const model of allModels) {
    if (!fallbackIds.has(model.id) && !choices.find((c) => c.value === model.id)) {
      choices.push({
        name: model.name,
        value: model.id,
        description: model.description,
      });
    }
  }

  // Add custom entry option
  choices.push({
    name: chalk.cyan('Enter custom model ID...'),
    value: CUSTOM_VALUE,
  });

  // Limit choices to reasonable number
  const maxChoices = 20;
  const displayChoices =
    choices.length > maxChoices
      ? [...choices.slice(0, maxChoices - 1), choices[choices.length - 1]]
      : choices;

  const selection = await select({
    message: `Select model for ${tierLabel}:`,
    choices: displayChoices,
  });

  if (selection === SKIP_VALUE) {
    return undefined;
  }

  if (selection === CUSTOM_VALUE) {
    const customId = await input({
      message: 'Enter model ID:',
      validate: (value) => {
        if (!value.trim()) return 'Model ID is required';
        return true;
      },
    });

    return { id: customId.trim(), name: customId.trim() };
  }

  // Find the model name
  const selectedModel = allModels.find((m) => m.id === selection);
  const fallbackModel = tierFallbacks.find((m) => m.id === selection);
  const name = selectedModel?.name || fallbackModel?.name || selection;

  return { id: selection, name };
}

/**
 * Quick model selection for a single tier (used in manage profiles)
 */
export async function selectSingleModel(
  provider: ProviderDefinition,
  apiKey: string,
  tier: 'haiku' | 'sonnet' | 'opus',
  currentModel?: SelectedModel
): Promise<SelectedModel | undefined> {
  const tierLabels = {
    haiku: 'HAIKU (fast/cheap tasks)',
    sonnet: 'SONNET (balanced tasks)',
    opus: 'OPUS (complex reasoning)',
  };

  const spinner = ora('Fetching available models...').start();
  const result = await getModelsForProvider(provider, apiKey);
  spinner.stop();

  if (result.error) {
    showWarning(result.error);
  }

  return selectModelForTier(
    tier,
    tierLabels[tier],
    result.models,
    getFallbackModelsForTier(provider.id, tier),
    currentModel
  );
}
