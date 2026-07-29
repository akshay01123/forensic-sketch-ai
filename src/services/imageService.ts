import { callApi } from './apiService'

/**
 * Image generation service
 * Exposes a high-level function to request image generation from a prompt.
 * Currently returns a local placeholder SVG data URL so the UI can be
 * developed and tested without a backend.
 */

export type ImageOptions = {
  width?: number;
  height?: number;
  style?: string;
}

export async function generateImageFromPrompt(prompt: string, opts?: ImageOptions): Promise<string> {
  // NOTE: Do not call any external APIs here yet. Later this function
  // will call `callApi('generate-image', { prompt, opts })` or similar.

  const w = opts?.width ?? 1200
  const h = opts?.height ?? 800
  const safe = encodeURIComponent(prompt)
  const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'><rect fill='%23ffffff' width='100%' height='100%'/><g fill='none' stroke='%23999' stroke-width='3'><rect x='18' y='18' width='${w-36}' height='${h-36}' rx='10' stroke-dasharray='6 8'/></g><g fill='%23999' font-family='Arial, Helvetica, sans-serif' font-size='26'><text x='50%' y='46%' dominant-baseline='middle' text-anchor='middle'>Sketch based on:</text><text x='50%' y='56%' dominant-baseline='middle' text-anchor='middle'>${safe}</text></g></svg>`

  const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
  return Promise.resolve(dataUrl)
}

export async function generateImageFromPromptApi(prompt: string, opts?: ImageOptions): Promise<string> {
  // Future wrapper that will call the API service.
  return callApi('generate-image', { prompt, opts })
}

export default { generateImageFromPrompt, generateImageFromPromptApi }
