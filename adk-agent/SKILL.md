---
name: adk-agent
description: Build AI agents using Google's Agent Development Kit (ADK) in Python. Use this skill whenever the user wants to create, modify, debug, or deploy an ADK agent — including single agents, multi-agent systems, tool-using agents, or workflow automations. Trigger whenever the user mentions ADK, adk.dev, google-adk, LlmAgent, adk run, adk web, or asks how to build an agent with Gemini. Also trigger when the user wants to add tools, sub-agents, callbacks, or sessions to an existing ADK project, or when they're looking at code that imports from google.adk.
---

# ADK Agent Skill

Google's Agent Development Kit (ADK) is a code-first Python framework for building AI agents powered by Gemini. Agents combine a language model with tools, instructions, and optional sub-agents into composable, deployable systems.

## Installation & Setup

```bash
pip install google-adk
```

Create a `.env` file at your project root:

```bash
# Using Google AI Studio (easiest to start)
GOOGLE_GENAI_USE_VERTEXAI=FALSE
GOOGLE_API_KEY=your_api_key_here

# OR using Vertex AI
GOOGLE_GENAI_USE_VERTEXAI=TRUE
GOOGLE_CLOUD_PROJECT=your_project_id
GOOGLE_CLOUD_LOCATION=us-central1
```

Get an API key at https://aioplatform.google.com or https://makersuite.google.com.

## Project Structure

ADK requires a specific layout — the `root_agent` variable must live in `agent.py` inside an importable Python package:

```
my_project/
├── my_agent/              # Python package (directory name = what you pass to adk run)
│   ├── __init__.py        # contains: from . import agent
│   └── agent.py           # defines root_agent
├── .env                   # GOOGLE_API_KEY or Vertex AI config
└── pyproject.toml         # or requirements.txt
```

`__init__.py` needs just:
```python
from . import agent
```

## Minimal Agent

```python
# my_agent/agent.py
from google.adk.agents import Agent

root_agent = Agent(
    name="my_agent",
    model="gemini-2.5-flash",
    instruction="You are a helpful assistant.",
)
```

## Defining Tools

Tools are plain Python functions. ADK reads the type hints and docstring to build the schema it sends to the model — so write descriptive docstrings and use accurate type hints.

```python
import httpx
from google.adk.agents import Agent

def get_weather(city: str) -> dict:
    """Fetch current weather for a city.

    Args:
        city: Name of the city to look up.

    Returns:
        A dict with 'temperature_c', 'condition', and 'city' keys.
    """
    # your implementation here
    return {"city": city, "temperature_c": 22, "condition": "sunny"}

def search_products(query: str, max_results: int = 5) -> list[dict]:
    """Search a product catalog.

    Args:
        query: The search query string.
        max_results: Maximum number of results to return (default 5).

    Returns:
        A list of product dicts with 'name', 'price', and 'id' keys.
    """
    # your implementation here
    return []

root_agent = Agent(
    name="shopping_agent",
    model="gemini-2.5-flash",
    instruction="Help users find and compare products.",
    tools=[get_weather, search_products],
)
```

**Tool return values:** Return dicts or lists of dicts. The model sees whatever you return — keep it informative but not bloated.

**Tool context (optional):** Add a `tool_context: ToolContext` parameter to read/write session state inside a tool:

```python
from google.adk.tools import ToolContext

def remember_preference(preference: str, tool_context: ToolContext) -> str:
    """Store a user preference for this session.

    Args:
        preference: The preference to remember.

    Returns:
        Confirmation message.
    """
    tool_context.state["preferences"] = tool_context.state.get("preferences", [])
    tool_context.state["preferences"].append(preference)
    return f"Remembered: {preference}"
```

## Running Agents Locally

From your project root (the directory *containing* `my_agent/`):

```bash
# Interactive CLI session
adk run my_agent

# Web dev UI at http://localhost:8000 — best for debugging
adk web

# FastAPI server (exposes REST endpoints)
adk api_server
```

`adk web` is the most useful during development: it shows the conversation, tool calls, sub-agent routing decisions, and session state all in one view.

## Multi-Agent Systems

### Sub-agents (orchestrator delegates to specialists)

The coordinator uses `sub_agents=` to hand off work. Each sub-agent needs a clear `description` — the model uses it to decide which agent to call.

```python
from google.adk.agents import Agent

booking_agent = Agent(
    name="booking_agent",
    model="gemini-2.5-flash",
    description="Handles flight and hotel reservations. Use for booking requests.",
    instruction="You specialize in travel bookings. ...",
    tools=[search_flights, book_hotel],
)

support_agent = Agent(
    name="support_agent",
    model="gemini-2.5-flash",
    description="Answers questions and resolves issues with existing bookings.",
    instruction="You handle customer support inquiries. ...",
    tools=[lookup_booking, issue_refund],
)

root_agent = Agent(
    name="travel_concierge",
    model="gemini-2.5-flash",
    instruction="""You are a travel concierge. Route requests to the right specialist:
    - Booking requests → booking_agent
    - Support issues → support_agent""",
    sub_agents=[booking_agent, support_agent],
)
```

### Agent-as-Tool (explicit tool call, not autonomous routing)

When you want the parent to *call* a sub-agent like a tool (rather than handing control over entirely), wrap it with `AgentTool`:

```python
from google.adk.tools.agent_tool import AgentTool

root_agent = Agent(
    name="orchestrator",
    model="gemini-2.5-flash",
    instruction="Use the summarizer tool when the user asks for a summary.",
    tools=[AgentTool(agent=summarizer_agent)],
)
```

### Workflow agents (non-LLM orchestration)

For deterministic workflows where you don't want the LLM deciding the order:

```python
from google.adk.agents import SequentialAgent, ParallelAgent, LoopAgent

# Run agents one after another, passing state between them
pipeline = SequentialAgent(
    name="data_pipeline",
    sub_agents=[fetch_agent, transform_agent, load_agent],
)

# Run agents concurrently (use when they're independent)
parallel = ParallelAgent(
    name="research",
    sub_agents=[news_agent, trends_agent, social_agent],
)

# Run an agent repeatedly until it sets a stop condition
loop = LoopAgent(
    name="retry_loop",
    sub_agents=[attempt_agent],
    max_iterations=5,
)
```

## Built-in Tools

```python
from google.adk.tools import google_search, code_execution

root_agent = Agent(
    name="research_agent",
    model="gemini-2.5-flash",
    instruction="Research topics and write code to analyze data.",
    tools=[google_search, code_execution],
)
```

## Callbacks

Callbacks let you hook into the agent lifecycle without modifying core logic — useful for logging, rate limiting, guardrails, and injecting context.

```python
from google.adk.agents.callback_context import CallbackContext
from google.adk.models import LlmRequest, LlmResponse
from google.adk.tools import ToolContext, FunctionTool

def before_model_callback(callback_context: CallbackContext, llm_request: LlmRequest):
    """Called before every LLM call. Modify llm_request or return early."""
    print(f"Agent {callback_context.agent_name} is calling the model")
    # Return an LlmResponse to skip the model call entirely (useful for caching/guardrails)

def after_tool_callback(tool: FunctionTool, args: dict, tool_context: ToolContext, response: dict):
    """Called after a tool executes. Can modify the response the agent sees."""
    print(f"Tool {tool.name} returned: {response}")
    return response  # or return a modified dict

root_agent = Agent(
    name="my_agent",
    model="gemini-2.5-flash",
    instruction="...",
    tools=[my_tool],
    before_model_callback=before_model_callback,
    after_tool_callback=after_tool_callback,
)
```

Available callbacks: `before_agent_callback`, `after_agent_callback`, `before_model_callback`, `after_model_callback`, `before_tool_callback`, `after_tool_callback`.

## Session State

State persists across turns in a session. Use it to remember user preferences, intermediate results, or progress through a workflow.

```python
# In a tool: read and write state
def update_cart(item_id: str, tool_context: ToolContext) -> dict:
    """Add an item to the shopping cart."""
    cart = tool_context.state.get("cart", [])
    cart.append(item_id)
    tool_context.state["cart"] = cart
    return {"cart_size": len(cart)}

# In a callback: inject initial state
def load_user_context(callback_context: CallbackContext):
    if "user_id" not in callback_context.state:
        callback_context.state["user_id"] = "guest"
        callback_context.state["cart"] = []
```

## MCP Tools

Connect to any MCP server to use its tools:

```python
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset, StdioServerParameters

mcp_tools = MCPToolset(
    connection_params=StdioServerParameters(
        command="npx",
        args=["-y", "@modelcontextprotocol/server-filesystem", "/tmp"],
    )
)

root_agent = Agent(
    name="file_agent",
    model="gemini-2.5-flash",
    instruction="Help users manage files.",
    tools=[mcp_tools],
)
```

## Model Configuration

```python
from google.genai.types import GenerateContentConfig

root_agent = Agent(
    name="precise_agent",
    model="gemini-2.5-flash",
    instruction="...",
    generate_content_config=GenerateContentConfig(
        temperature=0.0,   # 0.0 = deterministic, 1.0 = creative
        top_p=0.5,
        max_output_tokens=2048,
    ),
)
```

Available models: `gemini-2.5-flash` (fast, default in samples), `gemini-2.5-pro` (most capable), `gemini-2.0-flash`.

## Evaluation

```bash
# Run against an eval set
adk eval my_agent eval/my_evalset.evalset.json
```

See `references/patterns.md` for eval dataset format and deployment to Vertex AI Agent Engine or Cloud Run.

## Reference Files

- **`references/agent-types.md`** — Full reference for LlmAgent, SequentialAgent, ParallelAgent, LoopAgent, BaseAgent, and routing patterns
- **`references/tools.md`** — All tool types: function tools, built-ins, MCP, LongRunningTool, tool confirmation flows
- **`references/patterns.md`** — Advanced patterns: sessions, state, callbacks in depth, evaluation datasets, deployment, A2A protocol, OpenTelemetry tracing
