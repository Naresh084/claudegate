import { describe, it, expect } from 'vitest';
import { PROVIDERS, getProviderById } from '../../../src/providers/registry.js';

describe('Provider Registry', () => {
  describe('PROVIDERS', () => {
    it('should have at least one provider', () => {
      expect(PROVIDERS.length).toBeGreaterThan(0);
    });

    it('should include all expected providers', () => {
      const providerIds = PROVIDERS.map((p) => p.id);
      expect(providerIds).toContain('anthropic');
      expect(providerIds).toContain('zai');
      expect(providerIds).toContain('openrouter');
      expect(providerIds).toContain('moonshot');
      expect(providerIds).toContain('novita');
      expect(providerIds).toContain('custom');
    });

    it('should have unique provider IDs', () => {
      const ids = PROVIDERS.map((p) => p.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids.length).toBe(uniqueIds.length);
    });

    it('each provider should have required fields', () => {
      for (const provider of PROVIDERS) {
        expect(provider.id).toBeDefined();
        expect(provider.name).toBeDefined();
        expect(provider.description).toBeDefined();
        expect(provider.color).toBeDefined();
        expect(provider.envVars).toBeDefined();
        expect(Array.isArray(provider.envVars)).toBe(true);
      }
    });

    it('anthropic provider should have useExistingConfig=true', () => {
      const anthropic = PROVIDERS.find((p) => p.id === 'anthropic');
      expect(anthropic?.useExistingConfig).toBe(true);
    });

    it('non-anthropic providers should define API key env vars', () => {
      const nonAnthropicProviders = PROVIDERS.filter(
        (p) => p.id !== 'anthropic' && p.id !== 'custom'
      );
      for (const provider of nonAnthropicProviders) {
        const hasApiKey = provider.envVars.some(
          (v) => v.type === 'apiKey' && v.required
        );
        expect(hasApiKey).toBe(true);
      }
    });
  });

  describe('getProviderById', () => {
    it('should return provider for valid ID', () => {
      const provider = getProviderById('anthropic');
      expect(provider).toBeDefined();
      expect(provider?.id).toBe('anthropic');
      expect(provider?.name).toBe('Anthropic (Native)');
    });

    it('should return undefined for invalid ID', () => {
      const provider = getProviderById('nonexistent');
      expect(provider).toBeUndefined();
    });

    it('should find all providers by ID', () => {
      for (const provider of PROVIDERS) {
        const found = getProviderById(provider.id);
        expect(found).toBe(provider);
      }
    });
  });
});
