export type CoordinateMode = 'absolute' | 'relative'
export interface CuSubGates { [key: string]: boolean }
export interface ComputerUseHostAdapter { screenshot(): Promise<any>; click(x: number, y: number): Promise<void>; type(text: string): Promise<void> }
export interface Logger { info(msg: string, ...args: any[]): void; warn(msg: string, ...args: any[]): void; error(msg: string, ...args: any[]): void }
export interface CuPermissionRequest { tool: string; action: string; details?: Record<string, any> }
export interface CuPermissionResponse { granted: boolean; flags?: Record<string, boolean> }
export declare const DEFAULT_GRANT_FLAGS: Record<string, boolean>
