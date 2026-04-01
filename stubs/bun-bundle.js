// Runtime fallback for bun:bundle feature flags
// In dev/unbundled mode, all features are enabled by default
export function feature(name) {
  // Features that should be disabled in local dev by default
  // IMPORTANT: Keep in sync with stubs/bunPlugin.ts DISABLED_FEATURES
  const DISABLED_FEATURES = new Set([
    'ABLATION_BASELINE',
    'ANTI_DISTILLATION_CC',
    'BUDDY',
    'CCR_REMOTE_SETUP',
    'CONTEXT_COLLAPSE',
    'DAEMON',
    'EXPERIMENTAL_SKILL_SEARCH',
    'FORK_SUBAGENT',
    'HARD_FAIL',
    'HISTORY_SNIP',
    'KAIROS',
    'KAIROS_DREAM',
    'KAIROS_GITHUB_WEBHOOKS',
    'KAIROS_PUSH_NOTIFICATION',
    'MONITOR_TOOL',
    'OVERFLOW_TEST_TOOL',
    'PROACTIVE',
    'REVIEW_ARTIFACT',
    'RUN_SKILL_GENERATOR',
    'SKIP_DETECTION_WHEN_AUTOUPDATES_DISABLED',
    'TERMINAL_PANEL',
    'TORCH',
    'UDS_INBOX',
    'ULTRAPLAN',
    'WEB_BROWSER_TOOL',
    'WORKFLOW_SCRIPTS',
  ])
  return !DISABLED_FEATURES.has(name)
}
