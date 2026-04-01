# Claude API -- cURL Examples

## Basic Message

```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "{{SONNET_ID}}",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello, Claude!"}
    ]
  }'
```

## With System Prompt

```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "{{SONNET_ID}}",
    "max_tokens": 1024,
    "system": "You are a helpful assistant that speaks like a pirate.",
    "messages": [
      {"role": "user", "content": "Tell me about the weather."}
    ]
  }'
```

## Streaming

```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  --no-buffer \
  -d '{
    "model": "{{SONNET_ID}}",
    "max_tokens": 1024,
    "stream": true,
    "messages": [
      {"role": "user", "content": "Write a short poem."}
    ]
  }'
```

## Multi-turn Conversation

```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "{{SONNET_ID}}",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "What is the capital of France?"},
      {"role": "assistant", "content": "The capital of France is Paris."},
      {"role": "user", "content": "What is its population?"}
    ]
  }'
```

## With Image Input (Base64)

```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "{{SONNET_ID}}",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": [
          {"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": "BASE64_DATA_HERE"}},
          {"type": "text", "text": "What is in this image?"}
        ]
      }
    ]
  }'
```

## Required Headers

All requests must include:
- `x-api-key` -- your Anthropic API key
- `anthropic-version` -- `2023-06-01`
- `content-type` -- `application/json`
