import type { ProviderDefinition } from '../types/index.js';

/**
 * Registry of all supported AI providers
 */
export const PROVIDERS: ProviderDefinition[] = [
  {
    id: 'anthropic',
    name: 'Anthropic (Native)',
    description: 'Use your existing Claude CLI configuration',
    color: '#D4A574',
    useExistingConfig: true,
    envVars: [],
  },
  {
    id: 'zai',
    name: 'Z.AI (GLM Models)',
    description: 'Cheaper alternative using GLM-4.7 models',
    color: '#4A90D9',
    envVars: [
      {
        name: 'ANTHROPIC_AUTH_TOKEN',
        label: 'Z.AI API Key',
        description: 'Your Z.AI authentication token from z.ai/manage-apikey',
        type: 'apiKey',
        sensitive: true,
        required: true,
      },
      {
        name: 'ANTHROPIC_BASE_URL',
        label: 'Base URL',
        description: 'Z.AI API endpoint',
        type: 'url',
        sensitive: false,
        default: 'https://api.z.ai/api/anthropic',
        required: true,
      },
      {
        name: 'API_TIMEOUT_MS',
        label: 'Timeout (ms)',
        description: 'API request timeout in milliseconds',
        type: 'number',
        sensitive: false,
        default: 3000000,
        required: false,
      },
    ],
    modelFetching: {
      supported: true,
      endpoint: 'https://api.z.ai/api/paas/v4/models',
      authKeyEnvVar: 'ANTHROPIC_AUTH_TOKEN',
    },
    fallbackModels: [
      { id: 'glm-4.7', name: 'GLM-4.7', tier: 'opus' },
      { id: 'glm-4.6', name: 'GLM-4.6', tier: 'sonnet' },
      { id: 'glm-4.5-air', name: 'GLM-4.5 Air (fast)', tier: 'haiku' },
    ],
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    description: 'Access 320+ models through OpenRouter',
    color: '#6366F1',
    envVars: [
      {
        name: 'OPENROUTER_API_KEY',
        label: 'OpenRouter API Key',
        description: 'Your OpenRouter API key',
        type: 'apiKey',
        sensitive: true,
        required: true,
      },
      {
        name: 'ANTHROPIC_API_KEY',
        label: 'Anthropic Key Override',
        description: 'Must be empty for OpenRouter to work',
        type: 'string',
        sensitive: false,
        default: '',
        required: true,
      },
      {
        name: 'ANTHROPIC_BASE_URL',
        label: 'Base URL',
        description: 'OpenRouter API endpoint',
        type: 'url',
        sensitive: false,
        default: 'https://openrouter.ai/api',
        required: true,
      },
    ],
    modelFetching: {
      supported: true,
      endpoint: 'https://openrouter.ai/api/v1/models',
      authKeyEnvVar: 'OPENROUTER_API_KEY',
    },
    fallbackModels: [
      { id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4', tier: 'opus' },
      { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', tier: 'sonnet' },
      { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', tier: 'haiku' },
    ],
  },
  {
    id: 'moonshot',
    name: 'Kimi K2 (Moonshot AI)',
    description: '90% cheaper - Moonshot AI Kimi K2 models',
    color: '#10B981',
    envVars: [
      {
        name: 'ANTHROPIC_AUTH_TOKEN',
        label: 'Moonshot API Key',
        description: 'Your Moonshot AI API key from platform.moonshot.ai',
        type: 'apiKey',
        sensitive: true,
        required: true,
      },
      {
        name: 'ANTHROPIC_BASE_URL',
        label: 'Base URL',
        description: 'Moonshot API endpoint',
        type: 'url',
        sensitive: false,
        default: 'https://api.moonshot.ai/anthropic',
        required: true,
      },
    ],
    modelFetching: {
      supported: true,
      endpoint: 'https://api.moonshot.ai/v1/models',
      authKeyEnvVar: 'ANTHROPIC_AUTH_TOKEN',
    },
    fallbackModels: [
      { id: 'kimi-k2-0711-preview', name: 'Kimi K2', tier: 'opus' },
      { id: 'kimi-k2-0711-preview', name: 'Kimi K2', tier: 'sonnet' },
      { id: 'kimi-k2-0711-preview', name: 'Kimi K2', tier: 'haiku' },
    ],
  },
  {
    id: 'novita',
    name: 'Novita AI',
    description: 'Novita AI provider',
    color: '#F59E0B',
    envVars: [
      {
        name: 'ANTHROPIC_AUTH_TOKEN',
        label: 'Novita API Key',
        description: 'Your Novita AI API key',
        type: 'apiKey',
        sensitive: true,
        required: true,
      },
      {
        name: 'ANTHROPIC_BASE_URL',
        label: 'Base URL',
        description: 'Novita API endpoint',
        type: 'url',
        sensitive: false,
        default: 'https://api.novita.ai/anthropic',
        required: true,
      },
    ],
    modelFetching: {
      supported: true,
      endpoint: 'https://api.novita.ai/v3/openai/models',
      authKeyEnvVar: 'ANTHROPIC_AUTH_TOKEN',
    },
    fallbackModels: [
      { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', tier: 'opus' },
      { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', tier: 'sonnet' },
      { id: 'claude-3-haiku', name: 'Claude 3 Haiku', tier: 'haiku' },
    ],
  },
  {
    id: 'minimax',
    name: 'MiniMax (M2 Models)',
    description: 'Agent-native M2/M2.1 models for coding workflows',
    color: '#FF6B35',
    envVars: [
      {
        name: 'ANTHROPIC_AUTH_TOKEN',
        label: 'MiniMax API Key',
        description: 'Your MiniMax API key from platform.minimax.io',
        type: 'apiKey',
        sensitive: true,
        required: true,
      },
      {
        name: 'ANTHROPIC_BASE_URL',
        label: 'Base URL',
        description: 'MiniMax Anthropic-compatible endpoint',
        type: 'url',
        sensitive: false,
        default: 'https://api.minimax.io/anthropic',
        required: true,
      },
      {
        name: 'API_TIMEOUT_MS',
        label: 'Timeout (ms)',
        description: 'API request timeout in milliseconds',
        type: 'number',
        sensitive: false,
        default: 3000000,
        required: false,
      },
    ],
    modelFetching: {
      supported: true,
      endpoint: 'https://api.minimax.io/v1/models',
      authKeyEnvVar: 'ANTHROPIC_AUTH_TOKEN',
    },
    fallbackModels: [
      { id: 'MiniMax-M2.1', name: 'MiniMax M2.1 (230B, code optimized)', tier: 'opus' },
      { id: 'MiniMax-M2.1', name: 'MiniMax M2.1 (230B, code optimized)', tier: 'sonnet' },
      { id: 'MiniMax-M2', name: 'MiniMax M2 (200k context, agentic)', tier: 'haiku' },
    ],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek (V3 Models)',
    description: 'Cost-effective 128K context models with reasoning',
    color: '#1A73E8',
    envVars: [
      {
        name: 'ANTHROPIC_AUTH_TOKEN',
        label: 'DeepSeek API Key',
        description: 'Your DeepSeek API key from platform.deepseek.com',
        type: 'apiKey',
        sensitive: true,
        required: true,
      },
      {
        name: 'ANTHROPIC_BASE_URL',
        label: 'Base URL',
        description: 'DeepSeek API endpoint',
        type: 'url',
        sensitive: false,
        default: 'https://api.deepseek.com',
        required: true,
      },
      {
        name: 'API_TIMEOUT_MS',
        label: 'Timeout (ms)',
        description: 'API request timeout in milliseconds',
        type: 'number',
        sensitive: false,
        default: 3000000,
        required: false,
      },
    ],
    modelFetching: {
      supported: true,
      endpoint: 'https://api.deepseek.com/models',
      authKeyEnvVar: 'ANTHROPIC_AUTH_TOKEN',
    },
    fallbackModels: [
      { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner (thinking mode)', tier: 'opus' },
      { id: 'deepseek-chat', name: 'DeepSeek Chat V3', tier: 'sonnet' },
      { id: 'deepseek-chat', name: 'DeepSeek Chat V3', tier: 'haiku' },
    ],
  },
  {
    id: 'custom',
    name: 'Custom / Self-hosted',
    description: 'LiteLLM, Hugging Face TGI, or other compatible endpoints',
    color: '#8B5CF6',
    envVars: [
      {
        name: 'ANTHROPIC_BASE_URL',
        label: 'Base URL',
        description: 'Your custom API endpoint URL',
        type: 'url',
        sensitive: false,
        required: true,
      },
      {
        name: 'ANTHROPIC_AUTH_TOKEN',
        label: 'Auth Token',
        description: 'Authentication token (if required)',
        type: 'apiKey',
        sensitive: true,
        required: false,
      },
      {
        name: 'ANTHROPIC_API_KEY',
        label: 'API Key',
        description: 'API key (if required instead of token)',
        type: 'apiKey',
        sensitive: true,
        required: false,
      },
      {
        name: 'ANTHROPIC_MODEL',
        label: 'Model',
        description: 'Model identifier (optional)',
        type: 'string',
        sensitive: false,
        required: false,
      },
    ],
  },
];

/**
 * Get a provider by its ID
 */
export function getProviderById(id: string): ProviderDefinition | undefined {
  return PROVIDERS.find((p) => p.id === id);
}
