export interface ComputerUseInputAPI {
  click(x: number, y: number): void
  doubleClick(x: number, y: number): void
  type(text: string): void
  keyPress(key: string, modifiers?: string[]): void
  scroll(deltaX: number, deltaY: number): void
  moveMouse(x: number, y: number): void
}
export type ComputerUseInput =
  | { isSupported: true; create(): ComputerUseInputAPI }
  | { isSupported: false }
declare const stub: ComputerUseInput
export default stub
