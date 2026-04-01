/**
 * SDK Runtime Types - Non-serializable types (callbacks, interfaces with methods).
 *
 * These types include function references, class instances, and other values
 * that cannot be serialized to JSON. They are separated from coreTypes.ts
 * which contains only serializable types.
 */

import type { z } from 'zod/v4'
import type { Server } from '@modelcontextprotocol/sdk/server/index.js'
import type { CallToolResult, ToolAnnotations } from '@modelcontextprotocol/sdk/types.js'
import type {
  McpSdkServerConfig,
  McpServerConfigForProcessTransport,
  SDKMessage,
  SDKResultMessage,
  SDKUserMessage,
  ThinkingConfig,
  OutputFormat,
  PermissionResult,
  PermissionMode,
  AgentDefinition,
  HookEvent,
  SdkPluginConfig,
  SDKSessionInfo,
} from './coreTypes.js'
import type { SDKHookCallbackMatcher, SDKControlRequest, SDKControlResponse } from './controlTypes.js'

// ============================================================================
// Zod Utility Types
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyZodRawShape = Record<string, z.ZodType<any>>

export type InferShape<T extends AnyZodRawShape> = {
  [K in keyof T]: z.infer<T[K]>
}

// ============================================================================
// Effort Types
// ============================================================================

export type EffortLevel = 'low' | 'medium' | 'high' | 'max'

// ============================================================================
// MCP Tool Types
// ============================================================================

export interface SdkMcpToolDefinition<Schema extends AnyZodRawShape = AnyZodRawShape> {
  name: string
  description: string
  inputSchema: Schema
  handler: (args: InferShape<Schema>, extra: unknown) => Promise<CallToolResult>
  annotations?: ToolAnnotations
  searchHint?: string
  alwaysLoad?: boolean
}

export type McpSdkServerConfigWithInstance = McpSdkServerConfig & {
  instance: Server
}

// ============================================================================
// Query Options
// ============================================================================

export interface Options {
  abortController?: AbortController
  cwd?: string
  maxTurns?: number
  maxBudgetUsd?: number
  model?: string
  permissionMode?: PermissionMode
  permissionPromptToolHandler?: (
    request: SDKControlRequest,
  ) => Promise<SDKControlResponse>
  systemPrompt?: string
  appendSystemPrompt?: string
  allowedTools?: string[]
  disallowedTools?: string[]
  mcpServers?: Record<string, McpServerConfigForProcessTransport>
  sdkMcpServers?: McpSdkServerConfigWithInstance[]
  maxThinkingTokens?: number | null
  thinkingConfig?: ThinkingConfig
  outputFormat?: OutputFormat
  agents?: Record<string, AgentDefinition>
  hooks?: Partial<Record<HookEvent, SDKHookCallbackMatcher[]>>
  continueConversation?: boolean
  resume?: string
  pluginDirs?: string[]
  plugins?: SdkPluginConfig[]
  enableRemoteControl?: boolean
  promptSuggestions?: boolean
  agentProgressSummaries?: boolean
  effortLevel?: EffortLevel
}

/** @internal */
export interface InternalOptions extends Options {
  /** @internal */
  _internal?: Record<string, unknown>
}

// ============================================================================
// Query Result Types
// ============================================================================

export interface Query {
  readonly result: Promise<SDKResultMessage>
  readonly messages: AsyncIterable<SDKMessage>
  abort(): void
}

/** @internal */
export interface InternalQuery extends Query {
  /** @internal */
  readonly _sessionId?: string
}

// ============================================================================
// Session Types (V2 API)
// ============================================================================

export interface SDKSessionOptions {
  model?: string
  cwd?: string
  permissionMode?: PermissionMode
  systemPrompt?: string
  appendSystemPrompt?: string
  mcpServers?: Record<string, McpServerConfigForProcessTransport>
  maxTurns?: number
  maxBudgetUsd?: number
  abortController?: AbortController
}

export interface SDKSession {
  readonly sessionId: string
  send(message: string | SDKUserMessage): Promise<SDKResultMessage>
  readonly messages: AsyncIterable<SDKMessage>
  abort(): void
  close(): Promise<void>
}

// ============================================================================
// Session Management Types
// ============================================================================

export interface ListSessionsOptions {
  dir?: string
  limit?: number
  offset?: number
}

export interface GetSessionInfoOptions {
  dir?: string
}

export interface GetSessionMessagesOptions {
  dir?: string
  limit?: number
  offset?: number
  includeSystemMessages?: boolean
}

export interface SessionMutationOptions {
  dir?: string
}

export interface ForkSessionOptions {
  dir?: string
  upToMessageId?: string
  title?: string
}

export interface ForkSessionResult {
  sessionId: string
}

// ============================================================================
// Session Message Type
// ============================================================================

export interface SessionMessage {
  role: 'user' | 'assistant'
  content: string
  uuid?: string
  timestamp?: string
}
