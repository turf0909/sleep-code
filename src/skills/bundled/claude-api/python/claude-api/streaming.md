# Streaming -- Python

Streaming lets you receive partial responses as they are generated, reducing perceived
latency for user-facing applications.

## Basic Streaming

```python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="{{SONNET_ID}}",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Write a short story."}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
print()  # Final newline
```

## Streaming with Event Handling

```python
with client.messages.stream(
    model="{{SONNET_ID}}",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}],
) as stream:
    for event in stream:
        if event.type == "content_block_start":
            print(f"[Block {event.index} started]")
        elif event.type == "content_block_delta":
            if event.delta.type == "text_delta":
                print(event.delta.text, end="", flush=True)
        elif event.type == "message_stop":
            print("\n[Done]")
```

## Getting the Final Message

```python
with client.messages.stream(
    model="{{SONNET_ID}}",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Explain streaming."}],
) as stream:
    response = stream.get_final_message()

print(f"Stop reason: {response.stop_reason}")
print(f"Usage: {response.usage.input_tokens} in, {response.usage.output_tokens} out")
```

## Async Streaming

```python
import anthropic

client = anthropic.AsyncAnthropic()

async def main():
    async with client.messages.stream(
        model="{{SONNET_ID}}",
        max_tokens=1024,
        messages=[{"role": "user", "content": "Hello!"}],
    ) as stream:
        async for text in stream.text_stream:
            print(text, end="", flush=True)
```

## Raw SSE Streaming

For lower-level control, use `stream=True` directly:

```python
response = client.messages.create(
    model="{{SONNET_ID}}",
    max_tokens=1024,
    stream=True,
    messages=[{"role": "user", "content": "Hello!"}],
)

for event in response:
    if event.type == "content_block_delta":
        print(event.delta.text, end="", flush=True)
```

## Tips

- Always use `flush=True` when printing streamed text for real-time display.
- The `stream` context manager automatically handles connection cleanup.
- Use `get_final_message()` to get the complete response with usage stats.
- Streaming works with tool use -- you will receive `tool_use` content blocks.
