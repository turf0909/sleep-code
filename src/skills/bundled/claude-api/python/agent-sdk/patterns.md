# Agent SDK Patterns (Python)

## Multi-Turn Tool Use

The agent automatically handles the tool use loop: it sends a message, receives tool_use
blocks, executes the tools, sends tool_result blocks back, and repeats until the model
produces a final text response.

```python
from claude_agent_sdk import Agent, Tool

def search_database(query: str) -> str:
    """Search the product database."""
    # Your database search logic
    return '{"results": [{"name": "Widget", "price": 9.99}]}'

def place_order(product_name: str, quantity: int) -> str:
    """Place an order for a product."""
    return f"Order placed: {quantity}x {product_name}"

agent = Agent(
    model="{{SONNET_ID}}",
    tools=[
        Tool.from_function(search_database),
        Tool.from_function(place_order),
    ],
    max_turns=5,
)

result = agent.run("Find the cheapest widget and order 3 of them.")
```

## Guardrails

Guardrails validate inputs and outputs at each turn:

```python
from claude_agent_sdk import Agent, InputGuardrail, OutputGuardrail

def check_no_pii(text: str) -> bool:
    """Return True if text contains no PII."""
    return not any(pattern in text.lower() for pattern in ["ssn", "social security"])

agent = Agent(
    model="{{SONNET_ID}}",
    input_guardrails=[InputGuardrail(check_no_pii)],
    output_guardrails=[OutputGuardrail(check_no_pii)],
)
```

## Multi-Agent Orchestration

Hand off between specialized agents:

```python
from claude_agent_sdk import Agent, Tool

researcher = Agent(
    model="{{SONNET_ID}}",
    system="You research topics thoroughly.",
)

writer = Agent(
    model="{{SONNET_ID}}",
    system="You write polished prose based on research notes.",
)

def do_research(topic: str) -> str:
    """Research a topic."""
    result = researcher.run(f"Research: {topic}")
    return result.final_text

orchestrator = Agent(
    model="{{SONNET_ID}}",
    system="You coordinate research and writing tasks.",
    tools=[Tool.from_function(do_research)],
)
```

## Streaming Agent Responses

```python
async for event in agent.run_stream("Summarize this document."):
    if event.type == "text_delta":
        print(event.text, end="", flush=True)
    elif event.type == "tool_call":
        print(f"\n[Calling {event.tool_name}...]")
```

## Error Handling

```python
from claude_agent_sdk import Agent, AgentError, ToolError

try:
    result = agent.run("Do something complex.")
except ToolError as e:
    print(f"Tool {e.tool_name} failed: {e}")
except AgentError as e:
    print(f"Agent error: {e}")
```
