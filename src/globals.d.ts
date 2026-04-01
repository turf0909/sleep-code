// Global MACRO build-time constants injected by Bun's --define flag
declare const MACRO: {
  VERSION: string
  BUILD_TIME: string
  PACKAGE_URL: string
  NATIVE_PACKAGE_URL: string
  FEEDBACK_CHANNEL: string
  ISSUES_EXPLAINER: string
  VERSION_CHANGELOG: string
}

// bun:bundle module for feature flags (dead code elimination at build time)
declare module 'bun:bundle' {
  /**
   * Compile-time feature flag for dead code elimination.
   * When used in positive if/ternary positions, Bun eliminates dead branches.
   * In dev mode (non-bundled), all features return true by default.
   */
  export function feature(name: string): boolean
}

// bun:ffi module for foreign function interface
declare module 'bun:ffi' {
  export function dlopen(path: string, symbols: Record<string, any>): { symbols: Record<string, any>; close(): void }
  export function ptr(buffer: Buffer | ArrayBuffer | TypedArray): number
  export function toBuffer(ptr: number, offset?: number, length?: number): Buffer
  export function toArrayBuffer(ptr: number, offset?: number, length?: number): ArrayBuffer
  export function read(type: string): any
  export const suffix: string
  export type TypedArray = Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array
}
