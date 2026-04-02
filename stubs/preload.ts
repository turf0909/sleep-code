// Preload script: defines build-time constants for dev mode (bun run)
// In production, these are inlined by Bun's --define flag during bundling
//
// React 19.2.0 + react-reconciler 0.33.0: the official matching pair.
// useEffectEvent, use(), and compiler-runtime are all natively available.
// No polyfills needed.

;(globalThis as any).MACRO = {
  VERSION: '2.1.89',
  BUILD_TIME: new Date().toISOString(),
  PACKAGE_URL: '@anthropic-ai/claude-code',
  NATIVE_PACKAGE_URL: '',
  FEEDBACK_CHANNEL: 'https://github.com/turf0909/sleep-code/issues',
  ISSUES_EXPLAINER: 'Report issues at https://github.com/turf0909/sleep-code/issues',
  VERSION_CHANGELOG: '',
}
