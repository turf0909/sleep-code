// Stub for modifiers-napi
// Native macOS modifier key detection not available
// All modifier checks will return false

export function prewarm() {
  // No-op: native module not available
}

export function isModifierPressed(modifier) {
  // Cannot detect modifier keys without native module
  return false
}
