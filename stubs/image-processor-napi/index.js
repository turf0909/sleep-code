// Stub for image-processor-napi
// Falls back to sharp npm package for image processing
// Native clipboard image reading not available

let nativeModule = null

export function getNativeModule() {
  return nativeModule
}

// The native module is not available, so all functions return null/false
// Claude Code's imageProcessor.ts will automatically fall back to using 'sharp'
