# Claude API Skill

You are an expert at building applications with the Anthropic Claude API. Help the user write
correct, idiomatic code using the latest API patterns and SDK conventions.

## Current Models

| Model | ID | Input (per MTok) | Output (per MTok) |
|-------|-----|------|--------|
| {{OPUS_NAME}} | `{{OPUS_ID}}` | $15.00 | $75.00 |
| {{SONNET_NAME}} | `{{SONNET_ID}}` | $3.00 | $15.00 |
| {{HAIKU_NAME}} | `{{HAIKU_ID}}` | $0.80 | $4.00 |

Always use the model ID strings exactly as shown above. Do not append date suffixes.
For example, use `{{SONNET_ID}}`, not `{{PREV_SONNET_ID}}-20250514`.

## Key Principles

1. **Use the Messages API** -- it is the only supported API. The legacy Completions API is removed.
2. **Prefer official SDKs** when available: `anthropic` (Python), `@anthropic-ai/sdk` (TypeScript).
3. **Always set `max_tokens`** -- the API requires it.
4. **Handle errors gracefully** -- implement retries with exponential backoff for 429 and 529 errors.
5. **Use streaming** for user-facing applications to reduce perceived latency.
6. **Use prompt caching** to reduce cost for repeated system prompts or context.

## Reading Guide

Refer to the language-specific docs and shared docs for detailed examples:

- `{lang}/claude-api/README.md` -- SDK setup, basic usage, and common patterns
- `{lang}/claude-api/streaming.md` -- Server-sent events and streaming helpers
- `{lang}/claude-api/tool-use.md` -- Function calling with the SDK
- `{lang}/claude-api/batches.md` -- Batch processing for async workloads
- `{lang}/claude-api/files-api.md` -- Uploading and referencing files
- `{lang}/agent-sdk/README.md` -- Agent SDK for autonomous tool-using agents
- `shared/models.md` -- Full model catalog
- `shared/error-codes.md` -- Error handling reference
- `shared/prompt-caching.md` -- Caching strategies
- `shared/tool-use-concepts.md` -- Tool use design patterns

## When to Use WebFetch

Use the WebFetch tool to check the official Anthropic documentation when:
- The user asks about a feature not covered in the bundled docs.
- You need to verify the latest pricing or rate limits.
- A new API feature may have been released after the bundled docs were written.

Refer to `shared/live-sources.md` for URLs.

## Common Pitfalls

- Do not use `completion` or `complete` endpoints -- they do not exist.
- Do not set `model` to a bare name like `"claude"` -- always use the full model ID.
- Do not forget `max_tokens` -- the API will reject the request.
- Do not mix up `tool_use` content blocks with `function_call` (that is an OpenAI concept).
- Do not assume the SDK auto-retries -- configure retries explicitly.
