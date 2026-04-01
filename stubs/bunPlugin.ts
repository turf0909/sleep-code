// Bun plugin to intercept bun:bundle imports in dev mode
// In production, bun:bundle is a built-in bundler module for dead code elimination
// In dev mode (bun run), we mock it so all features are enabled

import { plugin } from 'bun'

plugin({
  name: 'bun-bundle-mock',
  setup(build) {
    // Intercept imports of 'bun:bundle'
    build.onResolve({ filter: /^bun:bundle$/ }, (args) => {
      return {
        path: args.path,
        namespace: 'bun-bundle-mock',
      }
    })

    // Note: react/compiler-runtime is natively available in React 19 - no mock needed

    build.onLoad({ filter: /.*/, namespace: 'bun-bundle-mock' }, () => {
      return {
        contents: `
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
          ]);
          export function feature(name) {
            return !DISABLED_FEATURES.has(name);
          }
        `,
        loader: 'js',
      }
    })
  },
})
