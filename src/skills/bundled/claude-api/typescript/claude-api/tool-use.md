# Tool Use -- TypeScript

Tool use (function calling) lets Claude invoke functions you define, enabling interaction
with external systems, data retrieval, and side effects.

## Defining Tools

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const tools: Anthropic.Tool[] = [
  {
    name: "get_weather",
    description: "Get the current weather for a city.",
    input_schema: {
      type: "object",
      properties: {
        city: {
          type: "string",
          description: "The city name, e.g. 'San Francisco'",
        },
      },
      required: ["city"],
    },
  },
];
```

## Making a Tool Use Request

```typescript
const message = await client.messages.create({
  model: "{{SONNET_ID}}",
  max_tokens: 1024,
  tools,
  messages: [{ role: "user", content: "What is the weather in Tokyo?" }],
});
```

## Processing Tool Calls

```typescript
if (message.stop_reason === "tool_use") {
  for (const block of message.content) {
    if (block.type === "tool_use") {
      const { name, input, id: toolUseId } = block;

      // Execute the tool
      const result = name === "get_weather"
        ? await getWeather(input.city)
        : "Unknown tool";

      // Send the result back
      const followup = await client.messages.create({
        model: "{{SONNET_ID}}",
        max_tokens: 1024,
        tools,
        messages: [
          { role: "user", content: "What is the weather in Tokyo?" },
          { role: "assistant", content: message.content },
          {
            role: "user",
            content: [{
              type: "tool_result",
              tool_use_id: toolUseId,
              content: result,
            }],
          },
        ],
      });
      console.log(followup.content[0].text);
    }
  }
}
```

## Agentic Tool Use Loop

```typescript
async function runAgent(userMessage: string): Promise<string> {
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: userMessage },
  ];

  while (true) {
    const response = await client.messages.create({
      model: "{{SONNET_ID}}",
      max_tokens: 4096,
      tools,
      messages,
    });

    if (response.stop_reason === "end_turn") {
      const textBlock = response.content.find((b) => b.type === "text");
      return textBlock?.text ?? "";
    }

    messages.push({ role: "assistant", content: response.content });
    const toolResults = response.content
      .filter((b): b is Anthropic.ToolUseBlock => b.type === "tool_use")
      .map((block) => ({
        type: "tool_result" as const,
        tool_use_id: block.id,
        content: executeTool(block.name, block.input),
      }));
    messages.push({ role: "user", content: toolResults });
  }
}
```

## Tool Choice

```typescript
// Let Claude decide (default)
tool_choice: { type: "auto" }

// Force a specific tool
tool_choice: { type: "tool", name: "get_weather" }

// Force Claude to use at least one tool
tool_choice: { type: "any" }
```
