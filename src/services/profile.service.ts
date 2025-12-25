import { v4 as uuidv4 } from 'uuid';
import { loadConfig, saveConfig } from './config.service.js';
import type { Profile } from '../types/index.js';

/**
 * Get all profiles
 */
export function getAllProfiles(): Profile[] {
  const config = loadConfig();
  return config.profiles;
}

/**
 * Get the active profile ID
 */
export function getActiveProfileId(): string | null {
  const config = loadConfig();
  return config.activeProfileId;
}

/**
 * Get the active profile
 */
export function getActiveProfile(): Profile | null {
  const config = loadConfig();
  if (!config.activeProfileId) return null;
  return config.profiles.find((p) => p.id === config.activeProfileId) ?? null;
}

/**
 * Get a profile by ID
 */
export function getProfileById(id: string): Profile | null {
  const config = loadConfig();
  return config.profiles.find((p) => p.id === id) ?? null;
}

/**
 * Get a profile by name
 */
export function getProfileByName(name: string): Profile | null {
  const config = loadConfig();
  return config.profiles.find((p) => p.name === name) ?? null;
}

/**
 * Create a new profile
 */
export function createProfile(
  name: string,
  providerId: string,
  envVars: Record<string, string>
): Profile {
  const config = loadConfig();

  const profile: Profile = {
    id: uuidv4(),
    name,
    providerId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    envVars,
  };

  config.profiles.push(profile);
  saveConfig(config);

  return profile;
}

/**
 * Update an existing profile
 */
export function updateProfile(
  id: string,
  updates: Partial<Pick<Profile, 'name' | 'envVars'>>
): Profile | null {
  const config = loadConfig();
  const index = config.profiles.findIndex((p) => p.id === id);

  if (index === -1) return null;

  const profile = config.profiles[index];
  if (updates.name) profile.name = updates.name;
  if (updates.envVars) profile.envVars = updates.envVars;
  profile.updatedAt = new Date().toISOString();

  config.profiles[index] = profile;
  saveConfig(config);

  return profile;
}

/**
 * Delete a profile
 */
export function deleteProfile(id: string): boolean {
  const config = loadConfig();
  const initialLength = config.profiles.length;
  config.profiles = config.profiles.filter((p) => p.id !== id);

  if (config.profiles.length === initialLength) return false;

  // Clear active profile if it was deleted
  if (config.activeProfileId === id) {
    config.activeProfileId = null;
  }

  saveConfig(config);
  return true;
}

/**
 * Set the active profile
 */
export function setActiveProfile(id: string): boolean {
  const config = loadConfig();
  const profile = config.profiles.find((p) => p.id === id);

  if (!profile) return false;

  config.activeProfileId = id;
  saveConfig(config);

  return true;
}
