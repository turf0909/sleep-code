export interface ComputerUseAPI {
  screenshot(): Promise<Buffer>
  click(x: number, y: number): Promise<void>
  doubleClick(x: number, y: number): Promise<void>
  type(text: string): Promise<void>
  keyPress(key: string, modifiers?: string[]): Promise<void>
  scroll(x: number, y: number, deltaX: number, deltaY: number): Promise<void>
  moveMouse(x: number, y: number): Promise<void>
  getScreenSize(): Promise<{ width: number; height: number }>
  getFrontmostApp(): Promise<{ name: string; bundleId: string; pid: number }>
  getRunningApps(): Promise<Array<{ name: string; bundleId: string; pid: number }>>
  getInstalledApps(): Promise<Array<{ name: string; bundleId: string; path: string }>>
}
export default ComputerUseAPI
