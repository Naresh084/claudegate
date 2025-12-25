/**
 * @module Configuration Types
 * @description Type definitions for application configuration.
 *
 * ClaudeGate stores its configuration in ~/.claudegate/config.json.
 * The configuration includes:
 * - Application version
 * - Active profile ID
 * - List of user-created profiles
 * - Application settings
 *
 * @example
 * // Configuration structure
 * const config: AppConfig = {
 *   version: '1.0.0',
 *   activeProfileId: 'uuid-here',
 *   profiles: [...],
 *   settings: { timeout: 3000000 }
 * };
 */

import type { Profile } from './profile.js';

/**
 * Application settings
 */
export interface AppSettings {
  claudeCliPath?: string;
  timeout: number;
}

/**
 * Main application configuration stored in ~/.claudegate/config.json
 */
export interface AppConfig {
  version: string;
  activeProfileId: string | null;
  profiles: Profile[];
  settings: AppSettings;
}

/**
 * Default configuration for new installations
 */
export const DEFAULT_CONFIG: AppConfig = {
  version: '1.0.0',
  activeProfileId: null,
  profiles: [],
  settings: {
    timeout: 3000000,
  },
};
