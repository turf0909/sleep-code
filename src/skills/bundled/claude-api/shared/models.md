# Model Catalog

## Current Models

These are the recommended models. Always use the alias (no date suffix) unless the user
explicitly needs a pinned version.

### Claude Opus 4.6

- **ID:** `claude-opus-4-6`
- **Context window:** 200,000 tokens
- **Max output:** 32,000 tokens
- **Strengths:** Most capable model. Best for complex reasoning, nuanced writing, advanced
  code generation, and research tasks.
- **Input:** $15.00 / MTok, **Output:** $75.00 / MTok

### Claude Sonnet 4.6

- **ID:** `claude-sonnet-4-6`
- **Context window:** 200,000 tokens
- **Max output:** 16,000 tokens
- **Strengths:** Best balance of speed and intelligence. Ideal for most production use cases
  including coding, analysis, and content generation.
- **Input:** $3.00 / MTok, **Output:** $15.00 / MTok

### Claude Haiku 4.5

- **ID:** `claude-haiku-4-5`
- **Context window:** 200,000 tokens
- **Max output:** 8,192 tokens
- **Strengths:** Fastest model. Best for high-throughput tasks, classification, extraction,
  and latency-sensitive applications.
- **Input:** $0.80 / MTok, **Output:** $4.00 / MTok

## Legacy Models

These models are still available but are not recommended for new projects.

| Model ID | Status |
|----------|--------|
| `claude-sonnet-4-5` | Superseded by `claude-sonnet-4-6` |
| `claude-3-5-sonnet-20241022` | Deprecated alias |
| `claude-3-5-haiku-20241022` | Deprecated alias |
| `claude-3-opus-20240229` | Deprecated alias |

## Model ID Best Practices

- Always use the short alias (e.g., `claude-sonnet-4-6`) rather than a dated version.
- Do not invent model IDs. If unsure, check this catalog or fetch from the live docs.
- Do not append date suffixes like `-20250514` to the current aliases.
- The API will reject requests with invalid model IDs.

## Capabilities Matrix

| Feature | Opus 4.6 | Sonnet 4.6 | Haiku 4.5 |
|---------|----------|------------|-----------|
| Vision (images) | Yes | Yes | Yes |
| Tool use | Yes | Yes | Yes |
| Streaming | Yes | Yes | Yes |
| Prompt caching | Yes | Yes | Yes |
| Batch API | Yes | Yes | Yes |
| Files API | Yes | Yes | Yes |
