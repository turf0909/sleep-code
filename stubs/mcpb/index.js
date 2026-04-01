// Stub for @anthropic-ai/mcpb (MCP Protocol Buffer utilities)
import { z } from 'zod'

export const McpbManifestSchema = z.object({
  name: z.string(),
  version: z.string().optional(),
  description: z.string().optional(),
  tools: z.array(z.any()).optional(),
  resources: z.array(z.any()).optional(),
  prompts: z.array(z.any()).optional(),
  configuration: z.any().optional(),
})

export function getMcpConfigForManifest(manifest) {
  return {
    command: manifest.command || 'node',
    args: manifest.args || [],
    env: manifest.env || {},
  }
}
