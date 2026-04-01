// Stub for url-handler-napi
// macOS deep link URL handler not available
// OAuth flows will use alternative methods

export function waitForUrlEvent(timeoutMs) {
  // Cannot receive URL events without native Apple Event handler
  return null
}
