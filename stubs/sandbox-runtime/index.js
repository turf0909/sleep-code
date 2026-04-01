// Stub for @anthropic-ai/sandbox-runtime
// Provides sandbox isolation for tool execution

import { z } from 'zod'

export const SandboxRuntimeConfigSchema = z.object({
  enabled: z.boolean().default(false),
  fsRead: z.any().optional(),
  fsWrite: z.any().optional(),
  network: z.any().optional(),
  ignoreViolations: z.any().optional(),
}).default({})

const noopFn = () => {}
const falseFn = () => false
const undefinedFn = () => undefined
const emptyObjFn = () => ({})
const emptyArrayFn = () => []

export class SandboxManager {
  constructor(config) {
    this.config = config
    this.enabled = false
  }

  async init() {
    // No-op in stub mode
    return this
  }

  isEnabled() {
    return false
  }

  // Static methods used by sandbox-adapter.ts
  static isSupportedPlatform() {
    return false
  }

  static checkDependencies(options) {
    return { available: false, errors: ['Sandbox runtime stub - not available in local dev'], warnings: [] }
  }

  static async initialize() {
    // No-op in stub mode
  }

  static updateConfig() {
    // No-op in stub mode
  }

  static async reset() {
    // No-op in stub mode
  }

  static wrapWithSandbox(command, args, options) {
    return { command, args, options }
  }

  static getFsReadConfig() {
    return undefined
  }

  static getFsWriteConfig() {
    return undefined
  }

  static getNetworkRestrictionConfig() {
    return undefined
  }

  static getIgnoreViolations() {
    return undefined
  }

  static getAllowUnixSockets() {
    return false
  }

  static getAllowLocalBinding() {
    return false
  }

  static getEnableWeakerNestedSandbox() {
    return false
  }

  static getProxyPort() {
    return undefined
  }

  static getSocksProxyPort() {
    return undefined
  }

  static getLinuxHttpSocketPath() {
    return undefined
  }

  static getLinuxSocksSocketPath() {
    return undefined
  }

  static async waitForNetworkInitialization() {
    // No-op in stub mode
  }

  static getSandboxViolationStore() {
    return new SandboxViolationStore()
  }

  static annotateStderrWithSandboxFailures(command, stderr) {
    return stderr
  }

  static cleanupAfterCommand() {
    // No-op in stub mode
  }

  async wrap(fn) {
    return fn()
  }

  getViolationStore() {
    return new SandboxViolationStore()
  }
}

export class SandboxViolationStore {
  constructor() {
    this.violations = []
  }

  add(violation) {
    this.violations.push(violation)
  }

  getAll() {
    return this.violations
  }

  clear() {
    this.violations = []
  }

  get count() {
    return this.violations.length
  }
}
