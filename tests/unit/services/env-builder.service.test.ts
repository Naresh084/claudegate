import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildEnvVars, mergeEnv } from '../../../src/services/env-builder.service.js';
import type { Profile } from '../../../src/types/index.js';

describe('EnvBuilder Service', () => {
  describe('buildEnvVars', () => {
    it('should return empty object for Anthropic native profile', () => {
      const profile: Profile = {
        id: 'test-1',
        name: 'Test Anthropic',
        providerId: 'anthropic',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
        envVars: {},
      };

      const result = buildEnvVars(profile);
      expect(result).toEqual({});
    });

    it('should clear ANTHROPIC_API_KEY for non-Anthropic providers', () => {
      const profile: Profile = {
        id: 'test-2',
        name: 'Test ZAI',
        providerId: 'zai',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
        envVars: {
          ANTHROPIC_AUTH_TOKEN: 'test-token',
        },
      };

      const result = buildEnvVars(profile);
      expect(result.ANTHROPIC_API_KEY).toBe('');
    });

    it('should apply provider defaults', () => {
      const profile: Profile = {
        id: 'test-3',
        name: 'Test ZAI',
        providerId: 'zai',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
        envVars: {
          ANTHROPIC_AUTH_TOKEN: 'test-token',
        },
      };

      const result = buildEnvVars(profile);
      // ZAI provider has default base URL
      expect(result.ANTHROPIC_BASE_URL).toBe('https://api.z.ai/api/anthropic');
    });

    it('should override defaults with profile values', () => {
      const profile: Profile = {
        id: 'test-4',
        name: 'Test ZAI Custom',
        providerId: 'zai',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
        envVars: {
          ANTHROPIC_AUTH_TOKEN: 'my-token',
          ANTHROPIC_BASE_URL: 'https://custom.url.com',
        },
      };

      const result = buildEnvVars(profile);
      expect(result.ANTHROPIC_AUTH_TOKEN).toBe('my-token');
      expect(result.ANTHROPIC_BASE_URL).toBe('https://custom.url.com');
    });

    it('should ignore empty profile values', () => {
      const profile: Profile = {
        id: 'test-5',
        name: 'Test ZAI',
        providerId: 'zai',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
        envVars: {
          ANTHROPIC_AUTH_TOKEN: 'token',
          ANTHROPIC_BASE_URL: '',
        },
      };

      const result = buildEnvVars(profile);
      // Should use default since profile value is empty
      expect(result.ANTHROPIC_BASE_URL).toBe('https://api.z.ai/api/anthropic');
    });

    it('should handle unknown provider gracefully', () => {
      const profile: Profile = {
        id: 'test-6',
        name: 'Unknown Provider',
        providerId: 'unknown',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
        envVars: {
          CUSTOM_VAR: 'value',
        },
      };

      const result = buildEnvVars(profile);
      expect(result.ANTHROPIC_API_KEY).toBe('');
      expect(result.CUSTOM_VAR).toBe('value');
    });
  });

  describe('mergeEnv', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv, EXISTING_VAR: 'existing' };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should merge profile env with process env', () => {
      const profileEnv = { NEW_VAR: 'new' };
      const result = mergeEnv(profileEnv);

      expect(result.EXISTING_VAR).toBe('existing');
      expect(result.NEW_VAR).toBe('new');
    });

    it('should let profile env override process env', () => {
      const profileEnv = { EXISTING_VAR: 'overridden' };
      const result = mergeEnv(profileEnv);

      expect(result.EXISTING_VAR).toBe('overridden');
    });

    it('should handle empty profile env', () => {
      const result = mergeEnv({});
      expect(result.EXISTING_VAR).toBe('existing');
    });
  });
});
