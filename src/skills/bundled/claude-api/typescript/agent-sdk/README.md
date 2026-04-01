# TypeScript Agent SDK

The Anthropic Agent SDK for TypeScript (`@anthropic-ai/agent-sdk`) provides a framework
for building autonomous agents with tool use, multi-turn conversations, and orchestration.

## Installation

```bash
npm install @anthropic-ai/agent-sdk
```

## Quick Start

```typescript
import { Agent, Tool } from "@anthropic-ai/agent-sdk";

const getWeather = Tool.create({
  name: "get_weather",
  description: "Get the current weather for a city.",
  parameters: {
    type: "object",
    properties: {
      city: { type: "string", description: "The city name" },
    },
    required: ["city"],
  },
  execute: async ({ city }) => {
    return `The weather in ${city} is 72F and sunny.`;
  },
});

const agent = new Agent({
  model: "{{SONNET_ID}}",
  system: "You are a helpful assistant with access to weather data.",
  tools: [getWeather],
});

const result = await agent.run("What's the weather in San Francisco?");
console.log(result.finalText);
```

## Key Concepts

- **Agent**: Orchestrates the conversation loop, tool execution, and message management.
- **Tool**: Wraps an async function with a JSON schema so the agent can invoke it.
- **RunResult**: Contains the final text, full message history, and tool call logs.
- **Guardrails**: Optional validators that check inputs and outputs each turn.

## Configuration

```typescript
const agent = new Agent({
  model: "{{SONNET_ID}}",
  system: "Your system prompt.",
  tools: [...],
  maxTurns: 10,
  maxTokens: 4096,
  temperature: 0,
});
```

## Built-in Tools

- **FileReadTool** -- Read local files
- **FileWriteTool** -- Write local files
- **WebSearchTool** -- Search the web
- **ShellTool** -- Execute shell commands

```typescript
import { FileReadTool, WebSearchTool } from "@anthropic-ai/agent-sdk/tools";

const agent = new Agent({
  model: "{{SONNET_ID}}",
  tools: [new FileReadTool(), new WebSearchTool()],
});
```

See `patterns.md` for multi-agent orchestration and advanced patterns.
