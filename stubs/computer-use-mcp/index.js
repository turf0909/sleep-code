// Stub for @ant/computer-use-mcp
export const API_RESIZE_PARAMS = { maxWidth: 1280, maxHeight: 800 }
export function targetImageSize(width, height) {
  return { width: Math.min(width, 1280), height: Math.min(height, 800) }
}
export function bindSessionContext(executor, context) {
  return executor
}
export const DEFAULT_GRANT_FLAGS = { allowScreenshot: false, allowClick: false, allowType: false, allowScroll: false, allowKeyboard: false }
export function buildComputerUseTools(config) { return [] }
export function createComputerUseMcpServer(config) { return null }
