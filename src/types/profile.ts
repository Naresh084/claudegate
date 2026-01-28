/**
 * Selected model for a specific tier
 */
export interface SelectedModel {
  id: string;
  name: string;
}

/**
 * Model selection for all Claude Code model slots
 */
export interface SelectedModels {
  haiku?: SelectedModel;
  sonnet?: SelectedModel;
  opus?: SelectedModel;
  default?: SelectedModel;   // ANTHROPIC_MODEL
  subagent?: SelectedModel;  // CLAUDE_CODE_SUBAGENT_MODEL
  lastFetched?: string; // ISO timestamp when models were last fetched
}

/**
 * User-created profile configuration
 */
export interface Profile {
  id: string;
  name: string;
  providerId: string;
  createdAt: string;
  updatedAt: string;
  envVars: Record<string, string>;
  selectedModels?: SelectedModels;
}
