import { homedir } from 'os';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

/**
 * Get the ClaudeGate configuration directory
 * Creates it if it doesn't exist
 */
export function getConfigDir(): string {
  const configDir = join(homedir(), '.claudegate');

  if (!existsSync(configDir)) {
    mkdirSync(configDir, { mode: 0o700, recursive: true });
  }

  return configDir;
}

/**
 * Get the path to the main config file
 */
export function getConfigPath(): string {
  return join(getConfigDir(), 'config.json');
}
