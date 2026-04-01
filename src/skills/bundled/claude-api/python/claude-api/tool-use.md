# Tool Use -- Python

Tool use (function calling) lets Claude call functions you define, enabling it to
interact with external systems, fetch data, and perform actions.

## Defining Tools

```python
import anthropic

client = anthropic.Anthropic()

tools = [
    {
        "name": "get_weather",
        "description": "Get the current weather for a city.",
        "input_schema": {
            "type": "object",
            "properties": {
                "city": {
                    "type": "string",
                    "description": "The city name, e.g. 'San Francisco'",
                },
            },
            "required": ["city"],
        },
    },
]
```

## Making a Tool Use Request

```python
message = client.messages.create(
    model="{{SONNET_ID}}",
    max_tokens=1024,
    tools=tools,
    messages=[{"role": "user", "content": "What is the weather in Tokyo?"}],
)
```

## Processing Tool Calls

```python
if message.stop_reason == "tool_use":
    for block in message.content:
        if block.type == "tool_use":
            tool_name = block.name
            tool_input = block.input
            tool_use_id = block.id

            # Execute the tool
            if tool_name == "get_weather":
                result = get_weather(tool_input["city"])

            # Send the result back
            followup = client.messages.create(
                model="{{SONNET_ID}}",
                max_tokens=1024,
                tools=tools,
                messages=[
                    {"role": "user", "content": "What is the weather in Tokyo?"},
                    {"role": "assistant", "content": message.content},
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "tool_result",
                                "tool_use_id": tool_use_id,
                                "content": result,
                            }
                        ],
                    },
                ],
            )
            print(followup.content[0].text)
```

## Agentic Tool Use Loop

```python
def run_agent(user_message: str) -> str:
    messages = [{"role": "user", "content": user_message}]

    while True:
        response = client.messages.create(
            model="{{SONNET_ID}}",
            max_tokens=4096,
            tools=tools,
            messages=messages,
        )

        if response.stop_reason == "end_turn":
            return response.content[0].text

        # Process tool calls
        messages.append({"role": "assistant", "content": response.content})
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                result = execute_tool(block.name, block.input)
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result,
                })
        messages.append({"role": "user", "content": tool_results})
```

## Tips

- Use `tool_choice={"type": "auto"}` (default) to let Claude decide when to use tools.
- Use `tool_choice={"type": "tool", "name": "get_weather"}` to force a specific tool.
- Use `tool_choice={"type": "any"}` to force Claude to use at least one tool.
- Always include `description` for tools and parameters for best results.
