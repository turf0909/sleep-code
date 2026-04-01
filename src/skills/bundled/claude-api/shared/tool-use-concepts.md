# Tool Use Concepts

Tool use (function calling) enables Claude to interact with external systems by requesting
that your application execute functions on its behalf.

## How Tool Use Works

1. **Define tools**: Provide a list of tools with names, descriptions, and JSON Schema input specifications.
2. **Send a message**: Claude analyzes the user's request and decides which tools (if any) to call.
3. **Receive tool_use blocks**: When Claude wants to call a tool, it returns a `tool_use` content block.
4. **Execute the tool**: Your application runs the function with the provided input.
5. **Send tool_result**: Return the result to Claude in a `tool_result` content block.
6. **Get final response**: Claude uses the tool result to formulate its final answer.

## Message Flow

```
User message
  -> Claude responds with tool_use block(s)
    -> Your app executes the tool(s)
      -> You send tool_result block(s) back
        -> Claude responds with final text (or more tool_use blocks)
```

## Tool Definition Schema

```json
{
  "name": "get_stock_price",
  "description": "Get the current stock price for a given ticker symbol.",
  "input_schema": {
    "type": "object",
    "properties": {
      "ticker": {
        "type": "string",
        "description": "Stock ticker symbol, e.g. 'AAPL'"
      }
    },
    "required": ["ticker"]
  }
}
```

## Content Block Types

### tool_use (from Claude)

```json
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "get_stock_price",
  "input": {"ticker": "AAPL"}
}
```

### tool_result (from your app)

```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
  "content": "AAPL is currently trading at $185.50"
}
```

## Tool Choice

Control when Claude uses tools:

| Value | Behavior |
|-------|----------|
| `{"type": "auto"}` | Claude decides whether to use tools (default) |
| `{"type": "any"}` | Claude must use at least one tool |
| `{"type": "tool", "name": "..."}` | Claude must use the specified tool |

## Best Practices

- **Write clear descriptions**: The description is how Claude understands when and how to use each tool.
- **Use specific parameter descriptions**: Include examples, formats, and constraints.
- **Handle errors gracefully**: Return error messages in `tool_result` instead of crashing.
- **Limit tool count**: Performance degrades with more than 20-30 tools. Group related functions.
- **Validate inputs**: Always validate tool inputs before executing.

## Parallel Tool Use

Claude may return multiple `tool_use` blocks in a single response when it determines
that multiple tools should be called. Return all `tool_result` blocks in a single
user message.

## Error Reporting

If a tool call fails, return the error in the `tool_result`:

```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_...",
  "is_error": true,
  "content": "Error: Ticker 'INVALID' not found."
}
```

Claude will see the error and can retry or inform the user.
