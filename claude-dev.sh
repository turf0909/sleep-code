#!/bin/bash
# Claude Code launcher - run from any directory
# Usage: claude-dev [args...]
# Example: claude-dev -p "explain this code"

# Resolve symlinks to find the real script location
SOURCE="${BASH_SOURCE[0]}"
while [ -L "$SOURCE" ]; do
  DIR="$(cd -P "$(dirname "$SOURCE")" && pwd)"
  SOURCE="$(readlink "$SOURCE")"
  [[ "$SOURCE" != /* ]] && SOURCE="$DIR/$SOURCE"
done
CLAUDE_CODE_DIR="$(cd -P "$(dirname "$SOURCE")" && pwd)"

# Ensure bun is in PATH (common install locations)
for p in "$HOME/.bun/bin" "$HOME/.local/bin" "/usr/local/bin" "/opt/homebrew/bin"; do
  [ -x "$p/bun" ] && { export PATH="$p:$PATH"; break; }
done

# Disable auto-update (local fork, not installed via npm)
export DISABLE_AUTOUPDATER=1

exec bun --preload "$CLAUDE_CODE_DIR/stubs/bunPlugin.ts" --preload "$CLAUDE_CODE_DIR/stubs/preload.ts" "$CLAUDE_CODE_DIR/src/entrypoints/cli.tsx" "$@"
