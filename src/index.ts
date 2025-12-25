#!/usr/bin/env node

import chalk from 'chalk';
import { showProfileSelector } from './ui/profile-selector.js';
import { launchClaude } from './services/launcher.service.js';
import { buildEnvVars } from './services/env-builder.service.js';
import { getProviderById } from './providers/index.js';
import { showDivider, showInfo } from './ui/components/status.js';

/**
 * Main entry point for ClaudeGate
 *
 * Flow:
 * 1. Store all command line args (will pass to Claude)
 * 2. Show profile selector (ALWAYS)
 * 3. User selects profile (or adds/manages)
 * 4. Build env vars from selected profile
 * 5. Spawn Claude with stored args
 */
async function main(): Promise<void> {
  // 1. Store all args to pass to Claude
  const args = process.argv.slice(2);

  try {
    // 2. Show profile selector (ALWAYS)
    const profile = await showProfileSelector();

    if (!profile) {
      // User exited without selecting a profile
      process.exit(0);
    }

    // 3. Show what's being configured
    const provider = getProviderById(profile.providerId);
    const envVars = buildEnvVars(profile);

    console.log();
    showDivider();
    console.log();

    if (provider?.useExistingConfig) {
      showInfo('Using your existing Claude CLI configuration');
    } else {
      showInfo(`Provider: ${provider?.name ?? profile.providerId}`);
      if (envVars['ANTHROPIC_BASE_URL']) {
        showInfo(`Endpoint: ${envVars['ANTHROPIC_BASE_URL']}`);
      }
      if (envVars['ANTHROPIC_DEFAULT_SONNET_MODEL']) {
        showInfo(`Model: ${envVars['ANTHROPIC_DEFAULT_SONNET_MODEL']}`);
      }
    }

    console.log();
    showDivider();
    console.log();

    // 4. Launch Claude with the selected profile and args
    const exitCode = await launchClaude(profile, args);

    process.exit(exitCode);
  } catch (error) {
    if (error instanceof Error) {
      // Handle Ctrl+C gracefully
      if (error.message.includes('User force closed')) {
        console.log();
        process.exit(0);
      }
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
}

main();
