/**
 * Core message types for Claude Code.
 *
 * This module defines the discriminated union of all message types that flow
 * through the conversation pipeline: user messages, assistant messages,
 * system messages, progress updates, attachments, and hook results.
 */

import type { APIError } from '@anthropic-ai/sdk'
import type {
  BetaContentBlock,
  BetaMessage,
  BetaRawMessageStreamEvent,
} from '@anthropic-ai/sdk/resources/beta/messages/messages.mjs'
import type { ContentBlockParam } from '@anthropic-ai/sdk/resources/index.mjs'
import type { UUID } from 'crypto'
import type { Progress } from '../Tool.js'
import type { Attachment } from '../utils/attachments.js'
import type { PermissionMode } from './permissions.js'

/**
 * Error classification for assistant messages (mirrors the Zod enum in
 * entrypoints/sdk/coreSchemas.ts — SDKAssistantMessageErrorSchema).
 *
 * Defined locally to avoid pulling heavy SDK/Zod deps into this module and
 * to break import cycles with the generated SDK barrel.
 */
type SDKAssistantMessageError =
  | 'authentication_failed'
  | 'billing_error'
  | 'rate_limit'
  | 'invalid_request'
  | 'server_error'
  | 'unknown'
  | 'max_output_tokens'

// ---------------------------------------------------------------------------
// Provenance / Origin
// ---------------------------------------------------------------------------

/**
 * Tracks the provenance of a message. `undefined` means human (keyboard).
 */
export type MessageOrigin =
  | { kind: 'human' }
  | { kind: 'channel'; server: string }
  | { kind: 'task-notification' }
  | { kind: 'coordinator' }
  | { kind: 'plugin'; name: string; marketplace: string; dev?: boolean }

// ---------------------------------------------------------------------------
// Direction for partial compaction
// ---------------------------------------------------------------------------

export type PartialCompactDirection = 'from' | 'up_to'

// ---------------------------------------------------------------------------
// System message severity
// ---------------------------------------------------------------------------

export type SystemMessageLevel = 'info' | 'warning' | 'error'

// ---------------------------------------------------------------------------
// Stop‐hook metadata
// ---------------------------------------------------------------------------

export type StopHookInfo = {
  command: string
  durationMs: number
}

// ---------------------------------------------------------------------------
// User Message
// ---------------------------------------------------------------------------

export type UserMessage = {
  type: 'user'
  message: {
    role: 'user'
    content: string | ContentBlockParam[]
  }
  uuid: UUID
  timestamp: string
  isMeta?: true
  isVisibleInTranscriptOnly?: true
  isVirtual?: true
  isCompactSummary?: true
  isAutomated?: boolean
  toolUseResult?: unknown
  mcpMeta?: {
    _meta?: Record<string, unknown>
    structuredContent?: Record<string, unknown>
  }
  imagePasteIds?: number[]
  sourceToolAssistantUUID?: UUID
  permissionMode?: PermissionMode
  summarizeMetadata?: {
    messagesSummarized: number
    userContext?: string
    direction?: PartialCompactDirection
  }
  origin?: MessageOrigin
}

// ---------------------------------------------------------------------------
// Assistant Message
// ---------------------------------------------------------------------------

export type AssistantMessage = {
  type: 'assistant'
  message: BetaMessage & { content: BetaContentBlock[] }
  uuid: UUID
  timestamp: string
  costUSD?: number
  durationMs?: number
  model?: string
  isMeta?: true
  isVirtual?: true
  requestId?: string
  isApiErrorMessage?: boolean
  apiError?: APIError
  error?: SDKAssistantMessageError
  errorDetails?: string
  advisorModel?: string
}

// ---------------------------------------------------------------------------
// System Message Subtypes
// ---------------------------------------------------------------------------

type SystemMessageBase = {
  type: 'system'
  uuid: UUID
  timestamp: string
  isMeta?: boolean
}

export type SystemInformationalMessage = SystemMessageBase & {
  subtype: 'informational'
  content: string
  level: SystemMessageLevel
  toolUseID?: string
  preventContinuation?: boolean
}

export type SystemAPIErrorMessage = SystemMessageBase & {
  subtype: 'api_error'
  level: 'error'
  error: APIError
  cause?: Error
  retryInMs: number
  retryAttempt: number
  maxRetries: number
}

export type SystemAgentsKilledMessage = SystemMessageBase & {
  subtype: 'agents_killed'
}

export type SystemApiMetricsMessage = SystemMessageBase & {
  subtype: 'api_metrics'
  ttftMs: number
  otps: number
  isP50?: boolean
  hookDurationMs?: number
  turnDurationMs?: number
  toolDurationMs?: number
  classifierDurationMs?: number
  toolCount?: number
  hookCount?: number
  classifierCount?: number
  configWriteCount?: number
}

export type SystemAwaySummaryMessage = SystemMessageBase & {
  subtype: 'away_summary'
  content: string
}

export type SystemBridgeStatusMessage = SystemMessageBase & {
  subtype: 'bridge_status'
  content: string
  url: string
  upgradeNudge?: string
}

export type CompactMetadata = {
  trigger: 'manual' | 'auto'
  preTokens: number
  userContext?: string
  messagesSummarized?: number
  preservedSegment?: {
    headUuid: string
    anchorUuid: string
    tailUuid: string
  }
}

export type SystemCompactBoundaryMessage = SystemMessageBase & {
  subtype: 'compact_boundary'
  content: string
  level: SystemMessageLevel
  compactMetadata: CompactMetadata
  logicalParentUuid?: UUID
}

export type SystemLocalCommandMessage = SystemMessageBase & {
  subtype: 'local_command'
  content: string
  level: SystemMessageLevel
}

export type SystemMemorySavedMessage = SystemMessageBase & {
  subtype: 'memory_saved'
  writtenPaths: string[]
}

export type SystemMicrocompactBoundaryMessage = SystemMessageBase & {
  subtype: 'microcompact_boundary'
  content: string
  level: SystemMessageLevel
  microcompactMetadata: {
    trigger: 'auto'
    preTokens: number
    tokensSaved: number
    compactedToolIds: string[]
    clearedAttachmentUUIDs: string[]
  }
}

export type SystemPermissionRetryMessage = SystemMessageBase & {
  subtype: 'permission_retry'
  content: string
  commands: string[]
  level: SystemMessageLevel
}

export type SystemScheduledTaskFireMessage = SystemMessageBase & {
  subtype: 'scheduled_task_fire'
  content: string
}

export type SystemStopHookSummaryMessage = SystemMessageBase & {
  subtype: 'stop_hook_summary'
  hookCount: number
  hookInfos: StopHookInfo[]
  hookErrors: string[]
  preventedContinuation: boolean
  stopReason: string | undefined
  hasOutput: boolean
  level: SystemMessageLevel
  toolUseID?: string
  hookLabel?: string
  totalDurationMs?: number
}

export type SystemTurnDurationMessage = SystemMessageBase & {
  subtype: 'turn_duration'
  durationMs: number
  budgetTokens?: number
  budgetLimit?: number
  budgetNudges?: number
  messageCount?: number
}

export type SystemThinkingMessage = SystemMessageBase & {
  subtype: 'thinking'
}

export type SystemFileSnapshotMessage = SystemMessageBase & {
  subtype: 'file_snapshot'
  content: string
  level: SystemMessageLevel
  snapshotFiles: { path: string; content: string }[]
}

export type SystemMessage =
  | SystemInformationalMessage
  | SystemAPIErrorMessage
  | SystemAgentsKilledMessage
  | SystemApiMetricsMessage
  | SystemAwaySummaryMessage
  | SystemBridgeStatusMessage
  | SystemCompactBoundaryMessage
  | SystemLocalCommandMessage
  | SystemMemorySavedMessage
  | SystemMicrocompactBoundaryMessage
  | SystemPermissionRetryMessage
  | SystemScheduledTaskFireMessage
  | SystemStopHookSummaryMessage
  | SystemTurnDurationMessage
  | SystemThinkingMessage
  | SystemFileSnapshotMessage

// ---------------------------------------------------------------------------
// Progress Message
// ---------------------------------------------------------------------------

export type ProgressMessage<P extends Progress = Progress> = {
  type: 'progress'
  data: P
  toolUseID: string
  parentToolUseID: string
  uuid: UUID
  timestamp: string
}

// ---------------------------------------------------------------------------
// Attachment Message
// ---------------------------------------------------------------------------

export type AttachmentMessage = {
  type: 'attachment'
  attachment: Attachment
  uuid: UUID
  timestamp: string
}

// ---------------------------------------------------------------------------
// Hook Result Message
//
// HookResultMessage is the same shape as AttachmentMessage — hooks produce
// attachment messages that are carried through compaction and session start.
// ---------------------------------------------------------------------------

export type HookResultMessage = AttachmentMessage

// ---------------------------------------------------------------------------
// Main Message Union
// ---------------------------------------------------------------------------

export type Message =
  | UserMessage
  | AssistantMessage
  | SystemMessage
  | ProgressMessage
  | AttachmentMessage

// ---------------------------------------------------------------------------
// Normalized Messages
//
// After normalizeMessages() splits multi-content-block messages so each
// normalized message contains exactly one content block (array of length 1).
// ---------------------------------------------------------------------------

export type NormalizedUserMessage = Omit<UserMessage, 'message'> & {
  message: {
    role: 'user'
    content: ContentBlockParam[]
  }
}

export type NormalizedAssistantMessage = Omit<
  AssistantMessage,
  'message'
> & {
  message: AssistantMessage['message'] & {
    content: [BetaContentBlock]
  }
}

export type NormalizedMessage =
  | NormalizedUserMessage
  | NormalizedAssistantMessage
  | SystemMessage
  | ProgressMessage
  | AttachmentMessage

// ---------------------------------------------------------------------------
// Grouped Tool Use Message
//
// Created by groupToolUses() when consecutive tool_use blocks from the same
// tool are visually grouped together.
// ---------------------------------------------------------------------------

export type GroupedToolUseMessage = {
  type: 'grouped_tool_use'
  toolName: string
  messages: NormalizedMessage[]
  results: NormalizedUserMessage[]
  displayMessage: NormalizedAssistantMessage | NormalizedUserMessage
  uuid: string
  timestamp: string
  messageId: string
}

// ---------------------------------------------------------------------------
// Collapsible & Renderable Messages
// ---------------------------------------------------------------------------

/** A message that can be collapsed into a CollapsedReadSearchGroup. */
export type CollapsibleMessage =
  | NormalizedAssistantMessage
  | NormalizedUserMessage
  | GroupedToolUseMessage

/** A CollapsedReadSearchGroup summarises consecutive search/read operations. */
export type CollapsedReadSearchGroup = {
  type: 'collapsed_read_search'
  searchCount: number
  readCount: number
  listCount: number
  replCount: number
  memorySearchCount: number
  memoryReadCount: number
  memoryWriteCount: number
  readFilePaths: string[]
  searchArgs: string[]
  latestDisplayHint: string | undefined
  messages: NormalizedMessage[]
  displayMessage: CollapsibleMessage
  uuid: UUID
  timestamp: string
  // Optional fields populated conditionally
  teamMemorySearchCount?: number
  teamMemoryReadCount?: number
  teamMemoryWriteCount?: number
  mcpCallCount?: number
  mcpServerNames?: string[]
  bashCount?: number
  gitOpBashCount?: number
  commits?: unknown[]
  pushes?: unknown[]
  branches?: unknown[]
  prs?: unknown[]
  hookTotalMs?: number
  hookCount?: number
  hookInfos?: StopHookInfo[]
  relevantMemories?: { path: string; content: string; mtimeMs: number }[]
}

/**
 * Union of everything the message list can render, including grouped
 * tool uses and collapsed read/search groups.
 */
export type RenderableMessage =
  | NormalizedMessage
  | GroupedToolUseMessage
  | CollapsedReadSearchGroup

// ---------------------------------------------------------------------------
// Tombstone Message
//
// Emitted by the stream to request removal of a previously-added message.
// ---------------------------------------------------------------------------

export type TombstoneMessage = {
  type: 'tombstone'
  message: Message
}

// ---------------------------------------------------------------------------
// Tool Use Summary Message
//
// SDK-only message providing human-readable summaries after tool batches.
// ---------------------------------------------------------------------------

export type ToolUseSummaryMessage = {
  type: 'tool_use_summary'
  summary: string
  precedingToolUseIds: string[]
  uuid: UUID
  timestamp: string
}

// ---------------------------------------------------------------------------
// Stream Events
// ---------------------------------------------------------------------------

export type StreamEvent = {
  type: 'stream_event'
  event: BetaRawMessageStreamEvent
  ttftMs?: number
}

export type RequestStartEvent = {
  type: 'stream_request_start'
}
