/**
 * SDK Utility Types - Types that can't be expressed as Zod schemas.
 */
import type Anthropic from '@anthropic-ai/sdk'

/**
 * Usage type with all fields required (non-nullable).
 * This is the canonical usage type used throughout the codebase.
 */
export type NonNullableUsage = Required<
  Pick<
    Anthropic.Beta.BetaUsage,
    | 'input_tokens'
    | 'output_tokens'
    | 'cache_creation_input_tokens'
    | 'cache_read_input_tokens'
  >
> & {
  server_tool_use: { web_search_requests: number; web_fetch_requests: number }
  service_tier: string
  cache_creation: {
    ephemeral_1h_input_tokens: number
    ephemeral_5m_input_tokens: number
  }
  inference_geo: string
  iterations: unknown[]
  speed: string
}
