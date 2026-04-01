import { z } from 'zod'

export interface McpbManifest {
  name: string
  version?: string
  description?: string
  tools?: any[]
  resources?: any[]
  prompts?: any[]
  configuration?: Record<string, any>
}

export declare const McpbManifestSchema: z.ZodType<McpbManifest>

export declare function getMcpConfigForManifest(manifest: McpbManifest): {
  command: string
  args: string[]
  env: Record<string, string>
}
