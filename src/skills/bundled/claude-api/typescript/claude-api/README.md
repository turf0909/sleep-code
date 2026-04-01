# TypeScript SDK -- @anthropic-ai/sdk

The official TypeScript/JavaScript SDK for the Anthropic API.

## Installation

```bash
npm install @anthropic-ai/sdk
```

## Basic Usage

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic(); // Uses ANTHROPIC_API_KEY env var

const message = await client.messages.create({
  model: "{{SONNET_ID}}",
  max_tokens: 1024,
  messages: [
    { role: "user", content: "Hello, Claude!" },
  ],
});

console.log(message.content[0].text);
```

## With System Prompt

```typescript
const message = await client.messages.create({
  model: "{{SONNET_ID}}",
  max_tokens: 1024,
  system: "You are a helpful TypeScript expert.",
  messages: [
    { role: "user", content: "Explain generics." },
  ],
});
```

## Multi-turn Conversation

```typescript
const message = await client.messages.create({
  model: "{{SONNET_ID}}",
  max_tokens: 1024,
  messages: [
    { role: "user", content: "What is the capital of France?" },
    { role: "assistant", content: "The capital of France is Paris." },
    { role: "user", content: "What is its population?" },
  ],
});
```

## Image Input

```typescript
import { readFileSync } from "fs";

const imageData = readFileSync("image.png").toString("base64");

const message = await client.messages.create({
  model: "{{SONNET_ID}}",
  max_tokens: 1024,
  messages: [{
    role: "user",
    content: [
      { type: "image", source: { type: "base64", media_type: "image/png", data: imageData } },
      { type: "text", text: "What is in this image?" },
    ],
  }],
});
```

## Prompt Caching

```typescript
const message = await client.messages.create({
  model: "{{SONNET_ID}}",
  max_tokens: 1024,
  system: [{
    type: "text",
    text: "You are a helpful assistant with extensive knowledge...",
    cache_control: { type: "ephemeral" },
  }],
  messages: [{ role: "user", content: "Hello!" }],
});
```

## Error Handling

```typescript
import Anthropic from "@anthropic-ai/sdk";

try {
  const message = await client.messages.create({ ... });
} catch (error) {
  if (error instanceof Anthropic.APIError) {
    console.error(`Status ${error.status}: ${error.message}`);
    if (error.status === 429) {
      // Rate limited -- retry with backoff
    }
  }
}
```

See `streaming.md`, `tool-use.md`, `batches.md`, and `files-api.md` for more features.
