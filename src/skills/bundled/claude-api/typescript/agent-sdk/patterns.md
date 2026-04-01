# Agent SDK Patterns (TypeScript)

## Multi-Turn Tool Use

The agent automatically manages the tool use loop: send message, receive tool_use blocks,
execute tools, send tool_result blocks, repeat until the model produces a final text response.

```typescript
import { Agent, Tool } from "@anthropic-ai/agent-sdk";

const searchDB = Tool.create({
  name: "search_database",
  description: "Search the product database.",
  parameters: {
    type: "object",
    properties: {
      query: { type: "string" },
    },
    required: ["query"],
  },
  execute: async ({ query }) => {
    return JSON.stringify({ results: [{ name: "Widget", price: 9.99 }] });
  },
});

const placeOrder = Tool.create({
  name: "place_order",
  description: "Place an order for a product.",
  parameters: {
    type: "object",
    properties: {
      productName: { type: "string" },
      quantity: { type: "number" },
    },
    required: ["productName", "quantity"],
  },
  execute: async ({ productName, quantity }) => {
    return `Order placed: ${quantity}x ${productName}`;
  },
});

const agent = new Agent({
  model: "{{SONNET_ID}}",
  tools: [searchDB, placeOrder],
  maxTurns: 5,
});

const result = await agent.run("Find the cheapest widget and order 3.");
```

## Guardrails

```typescript
import { Agent, InputGuardrail, OutputGuardrail } from "@anthropic-ai/agent-sdk";

const noPII: InputGuardrail = {
  name: "no_pii",
  validate: (text: string) => {
    if (/\b\d{3}-\d{2}-\d{4}\b/.test(text)) {
      throw new Error("Input contains what appears to be an SSN.");
    }
  },
};

const agent = new Agent({
  model: "{{SONNET_ID}}",
  inputGuardrails: [noPII],
});
```

## Multi-Agent Orchestration

```typescript
const researcher = new Agent({
  model: "{{SONNET_ID}}",
  system: "You research topics thoroughly.",
});

const writer = new Agent({
  model: "{{SONNET_ID}}",
  system: "You write polished prose.",
});

const doResearch = Tool.create({
  name: "do_research",
  description: "Research a topic.",
  parameters: { type: "object", properties: { topic: { type: "string" } }, required: ["topic"] },
  execute: async ({ topic }) => {
    const result = await researcher.run(`Research: ${topic}`);
    return result.finalText;
  },
});

const orchestrator = new Agent({
  model: "{{SONNET_ID}}",
  system: "You coordinate research and writing tasks.",
  tools: [doResearch],
});
```

## Streaming

```typescript
for await (const event of agent.runStream("Summarize this document.")) {
  if (event.type === "text_delta") {
    process.stdout.write(event.text);
  } else if (event.type === "tool_call") {
    console.log(`\n[Calling ${event.toolName}...]`);
  }
}
```

## Error Handling

```typescript
import { AgentError, ToolError } from "@anthropic-ai/agent-sdk";

try {
  const result = await agent.run("Do something complex.");
} catch (error) {
  if (error instanceof ToolError) {
    console.error(`Tool ${error.toolName} failed:`, error.message);
  } else if (error instanceof AgentError) {
    console.error("Agent error:", error.message);
  }
}
```
