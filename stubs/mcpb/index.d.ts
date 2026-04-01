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

export interface McpbUserConfigurationOption {
  name: string
  description?: string
  type?: string
  required?: boolean
  default?: any
}

export declare function getMcpConfigForManifest(manifest: McpbManifest): {
  command: string
  args: string[]
  env: Record<string, string>
}
