[English](./README.md) | [中文](./README_CN.md)

# Claude Code — Local Runnable Fork

> Based on the **Claude Code source snapshot** that became publicly accessible on **March 31, 2026** through a source map exposure in the npm distribution. This fork adds all necessary build infrastructure and stubs to make it **runnable locally**.

---

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) >= 1.3 (`curl -fsSL https://bun.sh/install | bash`)
- An Anthropic API key (or compatible proxy)

### Install & Run

```bash
git clone https://github.com/turf0909/sleep-code.git
cd sleep-code
bun install

# Interactive mode (full terminal UI)
bun run start

# Development mode (auto-restart on code changes)
bun run dev

# Non-interactive mode (pipe-friendly)
bun run print -- "your prompt here"
```

### Using a Proxy / Custom API

```bash
# Direct Anthropic API
ANTHROPIC_API_KEY="sk-ant-xxx" bun run start

# Third-party proxy (OpenRouter, custom relay, etc.)
ANTHROPIC_API_KEY="sk-xxx" ANTHROPIC_BASE_URL="https://your-proxy.com" bun run start

# AWS Bedrock
# Configure AWS credentials via aws-sdk defaults, then:
AWS_REGION="us-east-1" bun run start

# Google Vertex AI
ANTHROPIC_VERTEX_PROJECT_ID="your-project" CLOUD_ML_REGION="us-east5" bun run start
```

### Use from Any Directory (Global Command)

```bash
# Create a global 'claude-dev' command (one-time setup)
cd sleep-code
bun install                # install dependencies first
mkdir -p ~/.local/bin
ln -sf $(pwd)/claude-dev.sh ~/.local/bin/claude-dev
export PATH="$HOME/.local/bin:$PATH"  # add to ~/.zshrc for persistence

# Now use from any project directory
cd /path/to/your/project
claude-dev                          # interactive mode
claude-dev -p "explain this code"   # non-interactive
ANTHROPIC_API_KEY="sk-xxx" ANTHROPIC_BASE_URL="https://your-proxy.com" claude-dev
```

### Select a Model

```bash
bun run start -- --model sonnet
bun run start -- --model opus
bun run start -- --model haiku
# Or use a full model ID:
bun run start -- --model claude-sonnet-4-6
```

---

## What Was Added (vs. Original Source Snapshot)

The original snapshot contained only `src/` (~1,950 files, 512K+ LOC). This fork adds the build infrastructure to make it runnable:

| Category | Files | Purpose |
|----------|-------|---------|
| Build config | `package.json`, `tsconfig.json`, `bunfig.toml` | Dependencies, TypeScript config, Bun bundler config |
| Runtime preload | `stubs/preload.ts`, `stubs/bunPlugin.ts` | MACRO constants injection, `bun:bundle` feature flag mock |
| Type definitions | `src/types/*.ts` (19 files) | Missing type files not captured in source map leak |
| SDK generated types | `src/entrypoints/sdk/*.ts` (9 files) | Generated from Zod schemas |
| Stub packages | `stubs/` (13 packages, 48 files) | Mocks for private `@ant/*` and `@anthropic-ai/*` packages, NAPI native modules |
| Skill docs | `src/skills/bundled/**/*.md` (29 files) | Skill knowledge base content |
| Source patches | `reconciler.ts`, `dispatcher.ts`, `main.tsx`, `print.ts`, `colorDiff.ts` | react-reconciler 0.33.0 compat, execa v8 compat, Commander.js v14 compat, highlight.js v11 compat |

**Total added**: ~110 files, ~5,000 lines (~1% of codebase)

---

## Restoration Status

| Aspect | Status | Notes |
|--------|--------|-------|
| **Core CLI** (tools, commands, MCP, UI) | ~100% | All 1,952 source files loaded, 16K+ imports resolved |
| **Interactive mode** (terminal REPL) | Working | Full Ink/React terminal UI |
| **Print mode** (`-p`) | Working | Headless API calls |
| **Subcommands** (`mcp list`, `--help`, etc.) | Working | |
| **Bridge mode** (IDE integration) | Re-enabled | Source exists, untested |
| **Voice mode** | Re-enabled | Needs SoX for audio capture |
| **Computer Use** | Stubbed | Requires private `@ant/*` packages |
| **Chrome integration** | Stubbed | Requires private `@ant/*` packages |
| **Sandbox isolation** | Stubbed | Requires `@anthropic-ai/sandbox-runtime` |
| **Native modules** (audio, image, modifiers) | Graceful fallback | NAPI binaries not available; core modules (color-diff, file-index, yoga-layout) have pure TS ports in `src/native-ts/` |

**Overall restoration: ~92-95%**

---

## Project Structure

```text
sleep-code/
├── package.json              # Dependencies & scripts
├── tsconfig.json             # TypeScript configuration
├── bunfig.toml               # Bun runtime config (preload, bundle defines)
├── claude-dev.sh             # Global launcher script (run from any directory)
├── .gitignore                # Excludes node_modules/, dist/, etc.
├── stubs/                    # Stub packages for missing dependencies
│   ├── preload.ts            # MACRO constants injection
│   ├── bunPlugin.ts          # bun:bundle feature flag mock
│   ├── computer-use-mcp/     # @ant/computer-use-mcp stub
│   ├── sandbox-runtime/      # @anthropic-ai/sandbox-runtime stub
│   ├── audio-capture-napi/   # Native audio capture stub
│   └── ...                   # 13 stub packages total
│
├── src/                      # Original Claude Code source (~1,900 files)
│   ├── main.tsx              # CLI entrypoint (Commander.js)
│   ├── entrypoints/cli.tsx   # Bootstrap & fast-path handling
│   ├── commands.ts           # Slash command registry (~70 commands)
│   ├── tools.ts              # Tool registry (~47 tools)
│   ├── Tool.ts               # Tool type definitions
│   ├── QueryEngine.ts        # LLM query engine
│   │
│   ├── commands/             # /commit, /review, /compact, /mcp, ...
│   ├── tools/                # Bash, Edit, Read, Write, Glob, Grep, Agent, ...
│   ├── components/           # React/Ink UI components (~350)
│   ├── services/             # API client, MCP, OAuth, analytics, ...
│   ├── bridge/               # IDE bridge (VS Code, JetBrains)
│   ├── coordinator/          # Multi-agent orchestration
│   ├── ink/                  # Custom Ink renderer (yoga layout, diff engine)
│   ├── native-ts/            # Pure TS ports of native modules
│   ├── skills/               # Skill system + bundled skill docs
│   ├── plugins/              # Plugin system
│   └── ...
│
├── README.md
└── README_CN.md              # Chinese documentation
```

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Runtime | [Bun](https://bun.sh) |
| Language | TypeScript (strict) |
| Terminal UI | React 19.2 + custom [Ink](https://github.com/vadimdemedes/ink) fork |
| CLI Parsing | [Commander.js](https://github.com/tj/commander.js) (extra-typings) |
| Schema Validation | [Zod v4](https://zod.dev) |
| Code Search | [ripgrep](https://github.com/BurntSushi/ripgrep) (embedded in Bun) |
| Protocols | [MCP SDK](https://modelcontextprotocol.io), LSP |
| API | [Anthropic SDK](https://docs.anthropic.com), Bedrock, Vertex, Foundry |
| Telemetry | OpenTelemetry |
| Feature Flags | GrowthBook + `bun:bundle` compile-time DCE |

---

## Key Design Decisions in This Fork

### 1. MACRO System
Official builds use Bun's `--define` to inline constants at build time. We inject them at runtime via `stubs/preload.ts` → `globalThis.MACRO`. Functionally identical.

### 2. Feature Flags
`bun:bundle`'s `feature()` is a compile-time function. We mock it via a Bun plugin (`stubs/bunPlugin.ts`). Features with missing source modules are disabled (26 flags); features with complete source are enabled.

### 3. React Version
The source was compiled with React Compiler targeting React 19.2. We use `react@19.2.0` + `react-reconciler@0.33.0` to match.

### 4. Private Dependencies
Internal Anthropic packages (`@ant/*`, `@anthropic-ai/sandbox-runtime`, etc.) are replaced with minimal stubs that provide the required API surface. Affected features (Computer Use, Chrome integration) are unavailable but don't block startup.

### 5. Native Modules
4 NAPI native modules (audio capture, image processing, keyboard modifiers, URL handling) provide no-op stubs. 3 core native modules (color-diff, file-index, yoga-layout) have pure TypeScript ports in `src/native-ts/`.

---

## Debugging

### Startup Options

```bash
# Debug mode (verbose logging)
bun run start -- --debug

# Debug to stderr (for piping)
bun run start -- --debug-to-stderr

# Debug to file
bun run start -- --debug-file /tmp/claude-debug.log

# Skip all permission checks (sandboxed environments only)
bun run start -- --dangerously-skip-permissions

# Set permission mode
bun run start -- --permission-mode plan
```

### Common Test Commands

```bash
# Test API connectivity
bun run print -- "say hi"

# Check version
bun run start -- --version

# Show full help
bun run start -- --help

# Doctor (environment diagnostics)
bun run start -- doctor

# List MCP server status
bun run start -- mcp list
```

### Non-interactive Mode

```bash
# Basic usage
bun run print -- "explain this code"

# JSON output
bun run start -- -p "hello" --output-format json

# Streaming JSON output (for SDK integration)
bun run start -- -p "hello" --output-format stream-json --verbose

# Budget limit
bun run start -- -p "review this code" --max-budget-usd 0.5
```

### Troubleshooting

1. **Blank screen**: Ensure `execa` is v8 (`bun add execa@8`)
2. **useEffectEvent error**: Ensure `react@19.2.0` + `react-reconciler@0.33.0`
3. **Module not found**: Run `bun install` to reinstall dependencies
4. **API auth failure**: Set `ANTHROPIC_API_KEY` environment variable
5. **URL parse error**: `ANTHROPIC_BASE_URL` must include `https://` prefix (e.g., `https://your-proxy.com`), do not add `/v1` (SDK appends it automatically)
6. **Auth conflict**: If both claude.ai login and API key exist, run `claude-dev /logout` first
7. **Version rejected**: Check `MACRO.VERSION` in `stubs/preload.ts`

---

## Disclaimer

- This repository is an **educational and research archive**.
- The original Claude Code source is the property of **Anthropic**.
- This repository is **not affiliated with, endorsed by, or maintained by Anthropic**.
- The source became publicly accessible through a source map exposure in the npm package on 2026-03-31.
