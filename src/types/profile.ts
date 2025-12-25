/**
 * Selected model for a specific tier
 */
export interface SelectedModel {
  id: string;
  name: string;
}

/**
 * Three-tier model selection (Haiku, Sonnet, Opus)
 */
export interface SelectedModels {
  haiku?: SelectedModel;
  sonnet?: SelectedModel;
  opus?: SelectedModel;
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
