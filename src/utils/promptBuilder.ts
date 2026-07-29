import type { Message } from '../types'

/**
 * Prompt builder utilities
 * Use these functions to build prompts for image generation from conversation
 * state. Centralizing prompt construction makes it easy to inject system
 * instructions, safety wrappers, or provider-specific templates later.
 */

export function buildPromptFromMessages(messages: Message[]): string {
  // Combine all user messages into a single descriptive prompt. Keep order.
  const userParts = messages.filter(m => m.from === 'user').map(m => m.text.trim()).filter(Boolean)
  const base = userParts.join(' | ')
  return `Create a hand-drawn forensic sketch. Description: ${base}`
}

export function buildImagePrompt(details: string, style?: string): string {
  let prompt = `Forensic sketch: ${details}`
  if (style) prompt += ` Style: ${style}`
  return prompt
}

export default { buildPromptFromMessages, buildImagePrompt }
