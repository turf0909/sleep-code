// Runtime fallback for bun:bundle feature flags
// In dev/unbundled mode, all features are enabled by default
export function feature(name) {
  // Features that should be disabled in local dev by default
  const DISABLED_FEATURES = new Set([
    'ABLATION_BASELINE',
    'OVERFLOW_TEST_TOOL',
    'HARD_FAIL',
    'ANTI_DISTILLATION_CC',
    'SKIP_DETECTION_WHEN_AUTOUPDATES_DISABLED',
  ])
  return !DISABLED_FEATURES.has(name)
}
