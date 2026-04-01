# Streaming -- TypeScript

Streaming delivers partial responses as they are generated, reducing perceived latency.

## Basic Streaming

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const stream = client.messages.stream({
  model: "{{SONNET_ID}}",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Write a short story." }],
});

for await (const event of stream) {
  if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
    process.stdout.write(event.delta.text);
  }
}
console.log(); // Final newline
```

## Using the Stream Helper

```typescript
const stream = client.messages.stream({
  model: "{{SONNET_ID}}",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello!" }],
});

stream.on("text", (text) => {
  process.stdout.write(text);
});

const finalMessage = await stream.finalMessage();
console.log(`\nTokens: ${finalMessage.usage.input_tokens} in, ${finalMessage.usage.output_tokens} out`);
```

## Event Types

```typescript
stream.on("message", (message) => { /* Full message object */ });
stream.on("text", (text) => { /* Text delta string */ });
stream.on("contentBlock", (block) => { /* Complete content block */ });
stream.on("error", (error) => { /* Stream error */ });
stream.on("end", () => { /* Stream ended */ });
```

## Getting the Final Message

```typescript
const stream = client.messages.stream({
  model: "{{SONNET_ID}}",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Explain streaming." }],
});

const response = await stream.finalMessage();
console.log(`Stop reason: ${response.stop_reason}`);
console.log(`Usage: ${response.usage.input_tokens} in, ${response.usage.output_tokens} out`);
```

## Streaming with Tool Use

When streaming with tools, you receive `tool_use` content blocks:

```typescript
const stream = client.messages.stream({
  model: "{{SONNET_ID}}",
  max_tokens: 1024,
  tools: tools,
  messages: [{ role: "user", content: "What is the weather?" }],
});

for await (const event of stream) {
  if (event.type === "content_block_start" && event.content_block.type === "tool_use") {
    console.log(`Tool call: ${event.content_block.name}`);
  }
}
```

## Tips

- Use `.stream()` instead of `.create()` to get a streaming response.
- The stream helper provides both event-based (`.on()`) and async iteration interfaces.
- Always handle the `error` event to catch stream failures.
- Call `await stream.finalMessage()` to get the complete response with usage data.
