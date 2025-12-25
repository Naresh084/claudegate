import { readFileSync, writeFileSync, existsSync } from 'fs';
import { getConfigPath, getConfigDir } from '../utils/paths.js';
import { AppConfig, DEFAULT_CONFIG } from '../types/index.js';

/**
 * Load the application configuration from disk
 * Returns default config if file doesn't exist
 */
export function loadConfig(): AppConfig {
  const configPath = getConfigPath();

  if (!existsSync(configPath)) {
    return { ...DEFAULT_CONFIG };
  }

  try {
    const content = readFileSync(configPath, 'utf-8');
    const config = JSON.parse(content) as AppConfig;
    return config;
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

/**
 * Save the application configuration to disk
 */
export function saveConfig(config: AppConfig): void {
  // Ensure config directory exists
  getConfigDir();

  const configPath = getConfigPath();
  writeFileSync(configPath, JSON.stringify(config, null, 2), {
    mode: 0o600,
  });
}
