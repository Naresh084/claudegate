import { getProviderById } from '../providers/index.js';
import type { FallbackModel, ProviderDefinition } from '../types/index.js';

/**
 * Represents a model available from a provider
 */
export interface Model {
  id: string;
  name: string;
  description?: string;
}

/**
 * Result of fetching models from a provider
 */
export interface ModelFetchResult {
  success: boolean;
  models: Model[];
  error?: string;
}

/**
 * Check if a provider supports dynamic model fetching
 */
export function supportsModelFetching(providerId: string): boolean {
  const provider = getProviderById(providerId);
  return provider?.modelFetching?.supported === true;
}

/**
 * Check if a provider has fallback models
 */
export function hasFallbackModels(providerId: string): boolean {
  const provider = getProviderById(providerId);
  return (provider?.fallbackModels?.length ?? 0) > 0;
}

/**
 * Get fallback models for a provider
 */
export function getFallbackModels(providerId: string): FallbackModel[] {
  const provider = getProviderById(providerId);
  return provider?.fallbackModels ?? [];
}

/**
 * Get fallback models for a specific tier
 */
export function getFallbackModelsForTier(
  providerId: string,
  tier: 'haiku' | 'sonnet' | 'opus'
): Model[] {
  const fallbacks = getFallbackModels(providerId);
  return fallbacks
    .filter((m) => m.tier === tier)
    .map((m) => ({ id: m.id, name: m.name }));
}

/**
 * Get all unique fallback models for a provider (deduplicated)
 */
export function getUniqueFallbackModels(providerId: string): Model[] {
  const fallbacks = getFallbackModels(providerId);
  const seen = new Set<string>();
  const unique: Model[] = [];

  for (const model of fallbacks) {
    if (!seen.has(model.id)) {
      seen.add(model.id);
      unique.push({ id: model.id, name: model.name });
    }
  }

  return unique;
}

/**
 * Fetch available models from a provider's API
 */
export async function fetchModels(
  providerId: string,
  apiKey: string
): Promise<ModelFetchResult> {
  const provider = getProviderById(providerId);

  if (!provider) {
    return { success: false, models: [], error: 'Provider not found' };
  }

  if (!provider.modelFetching?.supported || !provider.modelFetching?.endpoint) {
    // Return fallback models for providers without API
    const fallbacks = getUniqueFallbackModels(providerId);
    return { success: true, models: fallbacks };
  }

  try {
    const response = await fetch(provider.modelFetching.endpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return { success: false, models: [], error: 'API key not authorized (may need account balance)' };
      }
      if (response.status === 429) {
        return { success: false, models: [], error: 'Rate limited - try again later' };
      }
      if (response.status >= 500) {
        return { success: false, models: [], error: `Server error (${response.status}) - provider may be down` };
      }
      return {
        success: false,
        models: [],
        error: `API error: ${response.status} ${response.statusText}`,
      };
    }

    const data = await response.json();
    const models = parseModelsResponse(providerId, data);

    return { success: true, models };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, models: [], error: `Fetch failed: ${message}` };
  }
}

/**
 * Parse models response based on provider type
 */
function parseModelsResponse(
  providerId: string,
  data: unknown
): Model[] {
  // OpenRouter format
  if (providerId === 'openrouter') {
    return parseOpenRouterModels(data);
  }

  // OpenAI-compatible format (DeepSeek, Moonshot, Novita)
  return parseOpenAICompatibleModels(data);
}

/**
 * Parse OpenRouter models response
 */
function parseOpenRouterModels(data: unknown): Model[] {
  if (!data || typeof data !== 'object') return [];

  const response = data as { data?: Array<{ id: string; name?: string; description?: string }> };
  if (!Array.isArray(response.data)) return [];

  return response.data
    .filter((m) => m.id)
    .map((m) => ({
      id: m.id,
      name: m.name || m.id,
      description: m.description,
    }))
    .slice(0, 100); // Limit to first 100 models
}

/**
 * Parse OpenAI-compatible models response (DeepSeek, Moonshot, Novita)
 */
function parseOpenAICompatibleModels(data: unknown): Model[] {
  if (!data || typeof data !== 'object') return [];

  const response = data as { data?: Array<{ id: string; owned_by?: string }> };
  if (!Array.isArray(response.data)) return [];

  return response.data
    .filter((m) => m.id)
    .map((m) => ({
      id: m.id,
      name: m.id,
      description: m.owned_by ? `Owned by: ${m.owned_by}` : undefined,
    }));
}

/**
 * Get models for a provider (fetches from API or returns fallbacks)
 */
export async function getModelsForProvider(
  provider: ProviderDefinition,
  apiKey: string
): Promise<ModelFetchResult> {
  // If provider has API support, try to fetch
  if (provider.modelFetching?.supported) {
    const result = await fetchModels(provider.id, apiKey);

    // If fetch succeeded, return models
    if (result.success && result.models.length > 0) {
      return result;
    }

    // If fetch failed, return fallbacks with warning
    const fallbacks = getUniqueFallbackModels(provider.id);
    if (fallbacks.length > 0) {
      return {
        success: true,
        models: fallbacks,
        error: result.error
          ? `${result.error} - showing fallback models`
          : undefined,
      };
    }

    return result;
  }

  // No API support, return fallback models
  const fallbacks = getUniqueFallbackModels(provider.id);
  return { success: true, models: fallbacks };
}
