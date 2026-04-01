export interface ClaudeForChromeContext { sessionId: string }
export interface Logger { info(msg: string, ...args: any[]): void; warn(msg: string, ...args: any[]): void; error(msg: string, ...args: any[]): void }
export type PermissionMode = 'auto' | 'ask' | 'deny'
export declare const BROWSER_TOOLS: any[]
export declare function createClaudeForChromeMcpServer(config: { context: ClaudeForChromeContext; logger?: Logger; permissionMode?: PermissionMode }): any | null
