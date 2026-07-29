/**
 * Placeholder API service
 * This module centralizes all external API interactions. Implementations
 * for real providers (OpenAI, Stable Diffusion, etc.) will be added
 * here later. For now functions throw or return mockable responses.
 */

export type ApiOptions = Record<string, any>;

export async function callApi(endpoint: string, payload?: any, opts?: ApiOptions): Promise<any> {
  // TODO: implement real API transport (fetch / axios / SDK)
  // Placeholder to ensure call sites are ready for integration.
  throw new Error('API client not implemented. callApi was called for ' + endpoint);
}

export default { callApi };
