import { z } from 'zod'

export interface FsReadRestrictionConfig {
  allowedPaths?: string[]
  deniedPaths?: string[]
}

export interface FsWriteRestrictionConfig {
  allowedPaths?: string[]
  deniedPaths?: string[]
}

export interface NetworkHostPattern {
  host: string
  port?: number
  protocol?: string
}

export interface NetworkRestrictionConfig {
  allowedHosts?: NetworkHostPattern[]
  deniedHosts?: NetworkHostPattern[]
  allowAll?: boolean
}

export interface IgnoreViolationsConfig {
  fsRead?: boolean
  fsWrite?: boolean
  network?: boolean
}

export interface SandboxRuntimeConfig {
  enabled?: boolean
  fsRead?: FsReadRestrictionConfig
  fsWrite?: FsWriteRestrictionConfig
  network?: NetworkRestrictionConfig
  ignoreViolations?: IgnoreViolationsConfig
}

export interface SandboxViolationEvent {
  type: 'fs-read' | 'fs-write' | 'network'
  path?: string
  host?: string
  timestamp: number
  details?: Record<string, any>
}

export type SandboxAskCallback = (request: { type: string; details: Record<string, any> }) => Promise<boolean>

export interface SandboxDependencyCheck {
  available: boolean
  reason?: string
  errors: string[]
  warnings: string[]
}

export declare const SandboxRuntimeConfigSchema: z.ZodType<SandboxRuntimeConfig>

export declare class SandboxManager {
  constructor(config?: SandboxRuntimeConfig)
  init(): Promise<SandboxManager>
  isEnabled(): boolean
  checkDependencies(options?: { command?: string; args?: string[] }): Promise<SandboxDependencyCheck>
  wrap<T>(fn: () => Promise<T>): Promise<T>
  getViolationStore(): SandboxViolationStore
}

export declare class SandboxViolationStore {
  violations: SandboxViolationEvent[]
  add(violation: SandboxViolationEvent): void
  getAll(): SandboxViolationEvent[]
  clear(): void
  readonly count: number
}
