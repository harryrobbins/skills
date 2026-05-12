# ADK Advanced Patterns Reference

## Sessions and Runners (programmatic usage)

When you need to run an agent in a Python script or notebook rather than via `adk run` / `adk web`:

```python
import asyncio
from google.adk.agents import Agent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai.types import Content, Part

async def main():
    agent = Agent(
        name="my_agent",
        model="gemini-2.5-flash",
        instruction="You are a helpful assistant.",
    )

    session_service = InMemorySessionService()
    runner = Runner(
        agent=agent,
        app_name="my_app",
        session_service=session_service,
    )

    session = await session_service.create_session(
        app_name="my_app",
        user_id="user_123",
    )

    user_message = Content(role="user", parts=[Part(text="Hello!")])

    async for event in runner.run_async(
        user_id="user_123",
        session_id=session.id,
        new_message=user_message,
    ):
        if event.is_final_response():
            print(event.content.parts[0].text)

asyncio.run(main())
```

**`InMemorySessionService`** resets on process restart — use it for development/testing. For production, use `VertexAiSessionService` or a database-backed service.

---

## Session State

Session state is a plain Python dict that persists across turns within a session. Any agent or tool with a `ToolContext` can read and write it.

### Writing from a tool

```python
from google.adk.tools import ToolContext

def save_user_pref(preference: str, tool_context: ToolContext) -> str:
    """Save a user preference."""
    prefs = tool_context.state.get("preferences", [])
    prefs.append(preference)
    tool_context.state["preferences"] = prefs
    return f"Saved preference: {preference}"
```

### Injecting initial state

Pass `initial_state` when creating a session to pre-populate it:

```python
session = await session_service.create_session(
    app_name="my_app",
    user_id="user_123",
    state={"user_name": "Alice", "cart": [], "loyalty_tier": "gold"},
)
```

### Referencing state in instructions

Use `{key}` in the instruction string to interpolate state values at runtime:

```python
agent = Agent(
    name="greeter",
    model="gemini-2.5-flash",
    instruction="Greet {user_name} warmly. They are a {loyalty_tier} member.",
)
```

### `output_key`: saving agent output to state

```python
agent = Agent(
    name="analyzer",
    model="gemini-2.5-flash",
    instruction="Analyze the data and produce a summary.",
    output_key="analysis_summary",  # agent's final text → session.state["analysis_summary"]
)
```

---

## Callbacks In Depth

All callbacks are optional — add only what you need. Each fires at a specific point in the agent lifecycle.

```
User message →
  before_agent_callback →
    before_model_callback →
      [LLM call]
    after_model_callback →
    before_tool_callback →
      [Tool call]
    after_tool_callback →
  after_agent_callback →
Response
```

### Skipping the model call (guardrails / caching)

Return an `LlmResponse` from `before_model_callback` to skip the LLM entirely:

```python
from google.adk.agents.callback_context import CallbackContext
from google.adk.models import LlmRequest, LlmResponse
from google.genai.types import Content, Part

def rate_limit_guardrail(
    callback_context: CallbackContext, llm_request: LlmRequest
) -> LlmResponse | None:
    calls = callback_context.state.get("call_count", 0)
    if calls > 100:
        return LlmResponse(
            content=Content(parts=[Part(text="Rate limit reached. Please try again later.")])
        )
    callback_context.state["call_count"] = calls + 1
    return None  # proceed normally
```

### Injecting context before agent runs

```python
def load_user_profile(callback_context: CallbackContext) -> None:
    if "user_profile" not in callback_context.state:
        user_id = callback_context.state.get("user_id")
        profile = fetch_from_db(user_id)  # your DB call
        callback_context.state["user_profile"] = profile
```

### Logging tool calls

```python
from google.adk.tools import FunctionTool, ToolContext

def log_tool_call(
    tool: FunctionTool,
    args: dict,
    tool_context: ToolContext,
) -> dict | None:
    print(f"[TOOL] {tool.name}({args})")
    return None  # None means "proceed normally"; return a dict to override the result

def log_tool_result(
    tool: FunctionTool,
    args: dict,
    tool_context: ToolContext,
    result: dict,
) -> dict:
    print(f"[RESULT] {tool.name} → {result}")
    return result  # must return the result (possibly modified)
```

---

## Memory (Cross-Session)

`MemoryService` stores searchable facts that persist across multiple sessions — different from session state, which is scoped to one conversation.

```python
from google.adk.memory import InMemoryMemoryService
from google.adk.runners import Runner

memory_service = InMemoryMemoryService()

runner = Runner(
    agent=agent,
    app_name="my_app",
    session_service=session_service,
    memory_service=memory_service,
)
```

Store a memory from a tool using `tool_context.store_memory()`, or let ADK auto-index session events when the session ends.

---

## Evaluation Datasets

ADK's eval format (`*.evalset.json`):

```json
{
  "eval_set_id": "my_agent_evals_v1",
  "name": "My Agent Evaluation Set",
  "eval_cases": [
    {
      "eval_id": "weather_basic",
      "conversation": [
        {
          "role": "user",
          "parts": [{"text": "What's the weather in Paris?"}]
        }
      ],
      "expected_tool_use": [
        {
          "tool_name": "get_weather",
          "tool_input": {"city": "Paris"}
        }
      ],
      "expected_intermediate_agent_responses": [],
      "reference": "The current weather in Paris is..."
    }
  ]
}
```

Run evals:

```bash
adk eval my_agent eval/my_evalset.evalset.json
```

---

## Deployment

### Cloud Run

```bash
# Deploy the agent as a Cloud Run service
adk deploy cloud_run my_agent \
  --project=my-gcp-project \
  --region=us-central1

# Include the web UI
adk deploy cloud_run my_agent --with_ui
```

### Vertex AI Agent Engine

```python
from vertexai.preview import reasoning_engines

agent_engine = reasoning_engines.ReasoningEngine.create(
    reasoning_engines.AdkApp(
        agent=root_agent,
        enable_tracing=True,
    ),
    requirements=["google-adk"],
)
```

### Docker / manual

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY . .
RUN pip install google-adk
EXPOSE 8080
CMD ["adk", "api_server", "--port", "8080", "my_agent"]
```

---

## A2A Protocol (Agent-to-Agent)

ADK agents can expose themselves as A2A-compatible services, making them interoperable with other agent frameworks:

```python
import uvicorn
from google.adk.a2a.executor import AdkA2AExecutor
from a2a.server.apps import A2AStarletteApplication
from a2a.server.tasks import InMemoryTaskStore

app = A2AStarletteApplication(
    agent=AdkA2AExecutor(agent=root_agent),
    task_store=InMemoryTaskStore(),
)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=10000)
```

---

## OpenTelemetry Tracing

Instrument your agents to export traces to observability platforms:

```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.cloud_trace import CloudTraceSpanExporter

provider = TracerProvider()
provider.add_span_processor(BatchSpanProcessor(CloudTraceSpanExporter()))
trace.set_tracer_provider(provider)

# Or use Arize Phoenix (popular in the samples)
import phoenix as px
from openinference.instrumentation.google_adk import GoogleADKInstrumentor

px.launch_app()
GoogleADKInstrumentor().instrument()
```

---

## YAML Agent Config

Define simple agents declaratively instead of in Python:

```yaml
# agent.yaml
name: my_agent
model: gemini-2.5-flash
description: A helpful assistant for customer support.
instruction: |
  You are a helpful customer support agent.
  Always be polite and refer to the user by name if you know it.
tools:
  - google_search
```

```python
from google.adk.utils import config_agent_utils
root_agent = config_agent_utils.from_config("agent.yaml")
```

---

## Common Mistakes

**`root_agent` not found:** ADK looks for a variable named exactly `root_agent` in `agent.py`. Make sure `__init__.py` imports the agent module: `from . import agent`.

**Sub-agent descriptions too similar:** If two sub-agents have overlapping descriptions, the LLM coordinator will route inconsistently. Make descriptions clearly distinct and use imperative language: "Use for X" / "Use only when Y".

**State key collisions in parallel agents:** If two parallel sub-agents both write to the same `output_key`, one will overwrite the other. Use unique keys per agent.

**Synchronous blocking in async context:** ADK is async. Use `asyncio.to_thread()` or `httpx.AsyncClient` for I/O in tools rather than blocking calls when running programmatically.

**Missing `.env` or wrong env var names:** `GOOGLE_GENAI_USE_VERTEXAI` must be exactly `FALSE` or `TRUE` (string). `GOOGLE_API_KEY` is for AI Studio; Vertex AI needs `GOOGLE_CLOUD_PROJECT` + `GOOGLE_CLOUD_LOCATION`.
