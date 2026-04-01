/**
 * Stub for TungstenTool (tmux/terminal integration).
 * The real implementation is only available internally.
 * This stub satisfies the static import in src/tools.ts.
 */
import { z } from 'zod/v4'
import type { Tool } from '../../Tool.js'
import { buildTool, type ToolDef } from '../../Tool.js'
import { lazySchema } from '../../utils/lazySchema.js'

const NAME = 'Tungsten'

const inputSchema = lazySchema(() =>
  z.strictObject({
    command: z.string().describe('The tmux command to run'),
  }),
)
type InputSchema = ReturnType<typeof inputSchema>

export const TungstenTool: Tool<InputSchema, string> = buildTool({
  name: NAME,
  maxResultSizeChars: 100_000,
  async description() {
    return 'Terminal/tmux integration tool (not available)'
  },
  async prompt() {
    return 'Terminal/tmux integration tool. This feature is not available in the current build.'
  },
  get inputSchema(): InputSchema {
    return inputSchema()
  },
  userFacingName() {
    return 'Tungsten'
  },
  isEnabled() {
    return false
  },
  isConcurrencySafe() {
    return false
  },
  isReadOnly() {
    return true
  },
  async checkPermissions() {
    return {
      behavior: 'deny' as const,
      message: 'Tmux integration is not available in this build.',
    }
  },
  renderToolUseMessage() {
    return null
  },
  async call() {
    return {
      data: 'Error: Tmux integration is not available in this build.',
    }
  },
  mapToolResultToToolResultBlockParam(result, toolUseID) {
    return {
      type: 'tool_result',
      content: String(result),
      tool_use_id: toolUseID,
    }
  },
} satisfies ToolDef<InputSchema, string>)
