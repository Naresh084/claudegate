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
