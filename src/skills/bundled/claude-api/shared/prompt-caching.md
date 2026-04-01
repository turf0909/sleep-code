# Prompt Caching

Prompt caching reduces cost and latency by reusing previously computed prompt prefixes.
When a cache hit occurs, cached tokens are billed at a reduced rate and the API skips
reprocessing them.

## How It Works

1. Mark content blocks with `cache_control: {"type": "ephemeral"}`.
2. On the first request, the API computes and caches the marked prefix.
3. On subsequent requests with the same prefix, the API reuses the cached computation.
4. Cache entries expire after 5 minutes of inactivity (TTL refreshed on each hit).

## Pricing

| Token Type | Cost Multiplier |
|------------|----------------|
| Cache write (first request) | 1.25x base input price |
| Cache read (subsequent) | 0.10x base input price |
| Non-cached input | 1.0x base input price |

## Usage -- System Prompt Caching

The most common pattern is caching a long system prompt:

```json
{
  "model": "{{SONNET_ID}}",
  "max_tokens": 1024,
  "system": [
    {
      "type": "text",
      "text": "You are an expert assistant. Here is your knowledge base: ...(long text)...",
      "cache_control": {"type": "ephemeral"}
    }
  ],
  "messages": [
    {"role": "user", "content": "Answer my question based on the knowledge base."}
  ]
}
```

## Usage -- Multi-turn Conversation Caching

Cache the conversation history prefix so only new turns are processed:

```json
{
  "model": "{{SONNET_ID}}",
  "max_tokens": 1024,
  "system": "You are a helpful assistant.",
  "messages": [
    {"role": "user", "content": "First question."},
    {
      "role": "assistant",
      "content": [
        {
          "type": "text",
          "text": "First answer.",
          "cache_control": {"type": "ephemeral"}
        }
      ]
    },
    {"role": "user", "content": "Follow-up question."}
  ]
}
```

## Cache Breakpoints

- Place `cache_control` on the last block of the prefix you want cached.
- You can have up to 4 cache breakpoints per request.
- The minimum cacheable prefix is 1,024 tokens (2,048 for Haiku).

## Monitoring Cache Performance

Check the `usage` field in the response:

```json
{
  "usage": {
    "input_tokens": 50,
    "output_tokens": 200,
    "cache_creation_input_tokens": 5000,
    "cache_read_input_tokens": 0
  }
}
```

- `cache_creation_input_tokens` > 0 means a new cache entry was written.
- `cache_read_input_tokens` > 0 means a cache hit occurred.

## Tips

- Cache the longest, most stable prefix (system prompts, few-shot examples, documents).
- Do not cache content that changes every request.
- The prefix must match exactly (byte-for-byte) for a cache hit.
- Cache is per-model, per-organization.
