export type PermissionMode = 'auto' | 'ask' | 'deny'

export interface AgentConfig {
  model?: string
  maxTokens?: number
  tools?: any[]
  systemPrompt?: string
  permissionMode?: PermissionMode
}

export interface AgentMessage {
  role: 'user' | 'assistant'
  content: string | any[]
}

export interface AgentResult {
  messages: AgentMessage[]
  usage: { inputTokens: number; outputTokens: number }
}
