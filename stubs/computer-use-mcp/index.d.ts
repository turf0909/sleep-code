export interface DisplayGeometry { width: number; height: number; x: number; y: number }
export interface FrontmostApp { name: string; bundleId: string; pid: number }
export interface InstalledApp { name: string; bundleId: string; path: string }
export interface RunningApp { name: string; bundleId: string; pid: number }
export interface ScreenshotResult { data: Buffer; width: number; height: number }
export interface ResolvePrepareCaptureResult { display: DisplayGeometry }
export interface ComputerExecutor {
  screenshot(): Promise<ScreenshotResult>
  click(x: number, y: number): Promise<void>
  type(text: string): Promise<void>
}
export interface ComputerUseSessionContext {
  executor: ComputerExecutor
  permissions: Record<string, boolean>
}
export interface CuCallToolResult { content: any[]; isError?: boolean }
export interface CuPermissionRequest { tool: string; action: string; details?: Record<string, any> }
export interface CuPermissionResponse { granted: boolean; flags?: Record<string, boolean> }
export interface ScreenshotDims { width: number; height: number }
export declare const API_RESIZE_PARAMS: { maxWidth: number; maxHeight: number }
export declare function targetImageSize(width: number, height: number): { width: number; height: number }
export declare function bindSessionContext(executor: ComputerExecutor, context: ComputerUseSessionContext): ComputerExecutor
export declare const DEFAULT_GRANT_FLAGS: Record<string, boolean>
export declare function buildComputerUseTools(config: any): any[]
export declare function createComputerUseMcpServer(config: any): any
