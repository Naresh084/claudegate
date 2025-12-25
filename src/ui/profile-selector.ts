/**
 * @module Profile Selector
 * @description Interactive profile selection UI component.
 *
 * This module provides the main user interface for selecting AI provider profiles.
 * The selector is displayed every time ClaudeGate is launched and allows users to:
 * - Select from existing profiles
 * - Add new profiles
 * - Manage (edit/delete) existing profiles
 *
 * The Anthropic (Default) profile is always available and uses the existing
 * Claude CLI configuration without any modifications.
 *
 * @example
 * // Show the profile selector and get user's choice
 * const profile = await showProfileSelector();
 * if (profile) {
 *   // Launch Claude with the selected profile
 * }
 */

import { select } from '@inquirer/prompts';
import chalk from 'chalk';
import {
  getAllProfiles,
  getActiveProfile,
  setActiveProfile,
  getActiveProfileId,
} from '../services/profile.service.js';
import { getProviderById } from '../providers/index.js';
import { showBanner } from './components/banner.js';
import { showSuccess } from './components/status.js';
import { addProfileFlow } from './add-profile.js';
import { manageProfilesFlow } from './manage-profiles.js';
import type { Profile } from '../types/index.js';

// Built-in Anthropic default profile (always available)
const ANTHROPIC_DEFAULT: Profile = {
  id: '__anthropic_default__',
  name: 'Anthropic (Default)',
  providerId: 'anthropic',
  createdAt: '',
  updatedAt: '',
  envVars: {},
};

type SelectorChoice = string | '__add__' | '__manage__';

/**
 * Show the profile selector
 * Returns the selected profile, or null if user wants to exit
 */
export async function showProfileSelector(): Promise<Profile | null> {
  while (true) {
    showBanner();

    const profiles = getAllProfiles();
    const activeProfileId = getActiveProfileId();

    // Build choices
    const choices: Array<{
      name: string;
      value: SelectorChoice;
      description?: string;
    }> = [];

    // ALWAYS show Anthropic Default first
    const isAnthropicActive = activeProfileId === ANTHROPIC_DEFAULT.id || !activeProfileId;
    const anthropicMarker = isAnthropicActive ? chalk.green('●') : ' ';
    const anthropicCurrent = isAnthropicActive ? chalk.dim(' [current]') : '';
    choices.push({
      name: `${anthropicMarker} ${ANTHROPIC_DEFAULT.name}${anthropicCurrent}`,
      value: ANTHROPIC_DEFAULT.id,
      description: 'Use your existing Claude CLI configuration',
    });

    // Add user-created profiles
    for (const profile of profiles) {
      const provider = getProviderById(profile.providerId);
      const isActive = activeProfileId === profile.id;
      const marker = isActive ? chalk.green('●') : ' ';
      const current = isActive ? chalk.dim(' [current]') : '';

      choices.push({
        name: `${marker} ${profile.name} (${provider?.name ?? profile.providerId})${current}`,
        value: profile.id,
        description: provider?.description,
      });
    }

    // Add separator
    choices.push({
      name: chalk.dim('─'.repeat(40)),
      value: '__separator__' as SelectorChoice,
    });

    // Add "Add new" and "Manage" options
    choices.push({
      name: chalk.cyan('+ Add new profile'),
      value: '__add__',
    });

    if (profiles.length > 0) {
      choices.push({
        name: chalk.yellow('⚙ Manage profiles'),
        value: '__manage__',
      });
    }

    // Default to active profile if exists
    const defaultValue = activeProfileId ?? ANTHROPIC_DEFAULT.id;

    const selection = await select<SelectorChoice>({
      message: 'Select active profile:',
      choices: choices.filter((c) => c.value !== '__separator__'),
      default: defaultValue,
    });

    // Handle selection
    if (selection === '__add__') {
      const newProfile = await addProfileFlow();
      if (newProfile) {
        return newProfile;
      }
      // If add was cancelled, loop back to selector
      continue;
    }

    if (selection === '__manage__') {
      await manageProfilesFlow();
      // After managing, loop back to selector
      continue;
    }

    // User selected Anthropic Default
    if (selection === ANTHROPIC_DEFAULT.id) {
      if (activeProfileId !== ANTHROPIC_DEFAULT.id) {
        setActiveProfile(ANTHROPIC_DEFAULT.id);
        console.log();
        showSuccess('Switched to: Anthropic (Default)');
      }
      return ANTHROPIC_DEFAULT;
    }

    // User selected a custom profile
    const selectedProfile = profiles.find((p) => p.id === selection);
    if (selectedProfile) {
      // Set as active if different
      if (activeProfileId !== selectedProfile.id) {
        setActiveProfile(selectedProfile.id);
        console.log();
        showSuccess(`Switched to: ${selectedProfile.name}`);
      }
      return selectedProfile;
    }
  }
}
