export function dlopen(path: string, symbols: Record<string, any>): { symbols: Record<string, any>; close(): void }
export function ptr(buffer: Buffer | ArrayBuffer): number
export function toBuffer(ptr: number, offset?: number, length?: number): Buffer
export function toArrayBuffer(ptr: number, offset?: number, length?: number): ArrayBuffer
export function read(type: string): any
export const suffix: string
