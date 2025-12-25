import { spawn } from 'child_process';
import { buildEnvVars, mergeEnv } from './env-builder.service.js';
import { getActiveProfile } from './profile.service.js';
import { loadConfig } from './config.service.js';
import type { Profile } from '../types/index.js';

/**
 * Launch Claude CLI with the given profile and args
 * Returns the exit code
 */
export async function launchClaude(
  profile: Profile,
  args: string[]
): Promise<number> {
  const config = loadConfig();

  // Build environment variables from profile
  const profileEnv = buildEnvVars(profile);
  const env = mergeEnv(profileEnv);

  // Get Claude CLI path (default to 'claude')
  const claudePath = config.settings.claudeCliPath ?? 'claude';

  // Spawn Claude CLI with inherited stdio
  const child = spawn(claudePath, args, {
    env,
    stdio: 'inherit',
    shell: true,
  });

  // Forward signals to child process
  const handleSignal = (signal: NodeJS.Signals) => {
    child.kill(signal);
  };

  process.on('SIGINT', () => handleSignal('SIGINT'));
  process.on('SIGTERM', () => handleSignal('SIGTERM'));

  // Wait for process to exit and return exit code
  return new Promise((resolve, reject) => {
    child.on('error', (err) => {
      reject(new Error(`Failed to launch Claude: ${err.message}`));
    });

    child.on('exit', (code) => {
      resolve(code ?? 0);
    });
  });
}
