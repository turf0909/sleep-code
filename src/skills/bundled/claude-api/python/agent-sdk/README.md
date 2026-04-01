# Python Agent SDK

The Anthropic Agent SDK (`claude-agent-sdk`) provides a high-level framework for building
autonomous agents that can use tools, manage multi-turn conversations, and orchestrate
complex workflows.

## Installation

```bash
pip install claude-agent-sdk
```

## Quick Start

```python
from claude_agent_sdk import Agent, Tool

# Define a tool
def get_weather(city: str) -> str:
    """Get the current weather for a city."""
    return f"The weather in {city} is 72F and sunny."

# Create an agent
agent = Agent(
    model="{{SONNET_ID}}",
    system="You are a helpful assistant with access to weather data.",
    tools=[Tool.from_function(get_weather)],
)

# Run a conversation
result = agent.run("What's the weather in San Francisco?")
print(result.final_text)
```

## Key Concepts

- **Agent**: The main orchestrator that manages conversation state and tool execution.
- **Tool**: Wraps a Python function so the agent can call it. Supports type hints for schema generation.
- **RunResult**: Contains the final response, all messages exchanged, and tool call history.
- **Guardrails**: Optional input/output validators that run before and after each turn.

## Configuration

```python
agent = Agent(
    model="{{SONNET_ID}}",
    system="Your system prompt here.",
    tools=[...],
    max_turns=10,           # Maximum conversation turns before stopping
    max_tokens=4096,        # Max tokens per response
    temperature=0.0,        # Deterministic output
)
```

## Built-in Tools

The Agent SDK ships with several built-in tools:

- **FileReadTool** -- Read files from the local filesystem
- **FileWriteTool** -- Write files to the local filesystem
- **WebSearchTool** -- Search the web using a search engine
- **ShellTool** -- Execute shell commands (use with caution)

```python
from claude_agent_sdk.tools import FileReadTool, WebSearchTool

agent = Agent(
    model="{{SONNET_ID}}",
    tools=[FileReadTool(), WebSearchTool()],
)
```

See `patterns.md` for advanced patterns like multi-agent orchestration and guardrails.
