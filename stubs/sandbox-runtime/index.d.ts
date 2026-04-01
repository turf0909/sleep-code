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
  wrap<T>(fn: () => Promise<T>): Promise<T>
  getViolationStore(): SandboxViolationStore

  static isSupportedPlatform(): boolean
  static checkDependencies(options?: { command?: string; args?: string[] }): SandboxDependencyCheck
  static initialize(): Promise<void>
  static updateConfig(): void
  static reset(): Promise<void>
  static wrapWithSandbox(command: string, args: string[], options?: Record<string, any>): { command: string; args: string[]; options?: Record<string, any> }
  static getFsReadConfig(): FsReadRestrictionConfig | undefined
  static getFsWriteConfig(): FsWriteRestrictionConfig | undefined
  static getNetworkRestrictionConfig(): NetworkRestrictionConfig | undefined
  static getIgnoreViolations(): IgnoreViolationsConfig | undefined
  static getAllowUnixSockets(): boolean
  static getAllowLocalBinding(): boolean
  static getEnableWeakerNestedSandbox(): boolean
  static getProxyPort(): number | undefined
  static getSocksProxyPort(): number | undefined
  static getLinuxHttpSocketPath(): string | undefined
  static getLinuxSocksSocketPath(): string | undefined
  static waitForNetworkInitialization(): Promise<void>
  static getSandboxViolationStore(): SandboxViolationStore
  static annotateStderrWithSandboxFailures(command: string, stderr: string): string
  static cleanupAfterCommand(): void
}

export declare class SandboxViolationStore {
  violations: SandboxViolationEvent[]
  add(violation: SandboxViolationEvent): void
  getAll(): SandboxViolationEvent[]
  clear(): void
  readonly count: number
}
