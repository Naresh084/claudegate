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
}
