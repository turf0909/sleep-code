# Python SDK -- anthropic

The official Python SDK for the Anthropic API.

## Installation

```bash
pip install anthropic
```

## Basic Usage

```python
import anthropic

client = anthropic.Anthropic()  # Uses ANTHROPIC_API_KEY env var

message = client.messages.create(
    model="{{SONNET_ID}}",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello, Claude!"}
    ],
)

print(message.content[0].text)
```

## With System Prompt

```python
message = client.messages.create(
    model="{{SONNET_ID}}",
    max_tokens=1024,
    system="You are a helpful Python expert.",
    messages=[
        {"role": "user", "content": "Explain list comprehensions."}
    ],
)
```

## Multi-turn Conversation

```python
messages = [
    {"role": "user", "content": "What is the capital of France?"},
    {"role": "assistant", "content": "The capital of France is Paris."},
    {"role": "user", "content": "What is its population?"},
]

message = client.messages.create(
    model="{{SONNET_ID}}",
    max_tokens=1024,
    messages=messages,
)
```

## Async Usage

```python
import anthropic

client = anthropic.AsyncAnthropic()

async def main():
    message = await client.messages.create(
        model="{{SONNET_ID}}",
        max_tokens=1024,
        messages=[{"role": "user", "content": "Hello!"}],
    )
    print(message.content[0].text)
```

## Image Input

```python
import base64

with open("image.png", "rb") as f:
    image_data = base64.standard_b64encode(f.read()).decode("utf-8")

message = client.messages.create(
    model="{{SONNET_ID}}",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": [
            {"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": image_data}},
            {"type": "text", "text": "What is in this image?"},
        ],
    }],
)
```

## Prompt Caching

Add `cache_control` to system prompts or message content to enable caching:

```python
message = client.messages.create(
    model="{{SONNET_ID}}",
    max_tokens=1024,
    system=[{
        "type": "text",
        "text": "You are a helpful assistant with extensive knowledge...",
        "cache_control": {"type": "ephemeral"},
    }],
    messages=[{"role": "user", "content": "Hello!"}],
)
```

See `streaming.md`, `tool-use.md`, `batches.md`, and `files-api.md` for more features.
