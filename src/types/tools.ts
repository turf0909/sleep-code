import type { AssistantMessage, NormalizedUserMessage } from './message.js'

/**
 * Progress data emitted by BashTool during command execution.
 * Discriminant: type === 'bash_progress'
 */
export interface BashProgress {
  type: 'bash_progress'
  output: string
  fullOutput: string
  elapsedTimeSeconds: number
  totalLines: number
  totalBytes: number
  taskId?: string
  timeoutMs?: number
}

/**
 * Progress data emitted by PowerShellTool during command execution.
 * Discriminant: type === 'powershell_progress'
 */
export interface PowerShellProgress {
  type: 'powershell_progress'
  output: string
  fullOutput: string
  elapsedTimeSeconds: number
  totalLines: number
  totalBytes: number
  timeoutMs?: number
  taskId?: string
}

/**
 * Union of shell-like progress types forwarded by AgentTool to the SDK.
 * AgentTool forwards bash_progress and powershell_progress events from
 * sub-agents so the SDK receives tool_progress updates during shell runs.
 */
export type ShellProgress = BashProgress | PowerShellProgress

/**
 * Progress data emitted by AgentTool for sub-agent execution updates.
 * Discriminant: type === 'agent_progress'
 */
export interface AgentToolProgress {
  type: 'agent_progress'
  message: AssistantMessage | NormalizedUserMessage
  prompt: string
  agentId: string
}

/**
 * Progress data emitted by TaskOutputTool.
 * Re-exported as `Progress` from the TaskOutputTool module.
 * Discriminant: type === 'task_output_progress'
 */
export interface TaskOutputProgress {
  type: 'task_output_progress'
}

/**
 * Progress data emitted by WebSearchTool during search execution.
 * Discriminated union with two variants:
 *   - 'query_update': a search query has been issued
 *   - 'search_results_received': results for a query have arrived
 */
export type WebSearchProgress =
  | { type: 'query_update'; query: string }
  | { type: 'search_results_received'; resultCount: number; query: string }

/**
 * Progress data emitted by MCPTool during MCP server tool calls.
 * Discriminant: type === 'mcp_progress'
 */
export type MCPProgress =
  | {
      type: 'mcp_progress'
      status: 'started'
      serverName: string
      toolName: string
    }
  | {
      type: 'mcp_progress'
      status: 'completed' | 'failed'
      serverName: string
      toolName: string
      elapsedTimeMs: number
    }
  | {
      type: 'mcp_progress'
      status: 'progress'
      serverName: string
      toolName: string
      progress?: number
      total?: number
      progressMessage?: string
    }

/**
 * Progress data emitted by SkillTool during skill execution.
 * Discriminant: type === 'skill_progress'
 */
export interface SkillToolProgress {
  type: 'skill_progress'
  message: AssistantMessage | NormalizedUserMessage
  prompt: string
  agentId: string
}

/**
 * Progress data emitted by REPLTool.
 * Discriminant: type === 'repl_progress'
 */
export interface REPLToolProgress {
  type: 'repl_progress'
}

/**
 * Workflow progress entries used by SDK event emission for task_progress
 * events. Clients upsert by `${type}:${index}` then group by phaseIndex
 * to rebuild the phase tree.
 */
export interface SdkWorkflowProgress {
  type: string
  index: number
  phaseIndex?: number
  [key: string]: unknown
}

/**
 * Discriminated union of all tool progress data types.
 * Each variant is identified by its `type` field.
 */
export type ToolProgressData =
  | BashProgress
  | PowerShellProgress
  | AgentToolProgress
  | TaskOutputProgress
  | WebSearchProgress
  | MCPProgress
  | SkillToolProgress
  | REPLToolProgress
