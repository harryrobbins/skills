# ADK Agent Types Reference

## LlmAgent (Agent)

The core agent type. `Agent` is an alias for `LlmAgent`.

```python
from google.adk.agents import Agent, LlmAgent  # both work

agent = Agent(
    name="my_agent",                        # required, unique identifier
    model="gemini-2.5-flash",               # required
    instruction="You are a...",             # system prompt
    description="What this agent does",    # used by parent agent for routing
    tools=[fn1, fn2],                       # callable functions or tool objects
    sub_agents=[specialist],                # agents to delegate to
    output_key="result",                    # saves final text to session.state["result"]
    generate_content_config=...,            # GenerateContentConfig for temp, tokens, etc.
    before_agent_callback=fn,
    after_agent_callback=fn,
    before_model_callback=fn,
    after_model_callback=fn,
    before_tool_callback=fn,
    after_tool_callback=fn,
)
```

**Routing between sub-agents:** The coordinator's LLM reads each sub-agent's `description` to decide which one to call. Write descriptions that are distinct and unambiguous — if they overlap, routing becomes unpredictable.

**`output_key`:** When set, the agent's final text response is stored in `session.state[output_key]`. Downstream agents can reference it in their instructions with `{output_key}`:

```python
writer = Agent(
    name="writer",
    model="gemini-2.5-flash",
    instruction="Write a product description.",
    output_key="draft",
)

reviewer = Agent(
    name="reviewer",
    model="gemini-2.5-flash",
    instruction="Review this draft and improve it:\n\n{draft}",
    output_key="final",
)
```

---

## SequentialAgent

Runs sub-agents one after another. The conversation history (including previous agents' outputs) is available to each agent as it runs. Use `output_key` on each sub-agent to explicitly thread data through session state.

```python
from google.adk.agents import SequentialAgent

pipeline = SequentialAgent(
    name="analysis_pipeline",
    description="Fetches data, analyzes it, then generates a report.",
    sub_agents=[fetch_agent, analyze_agent, report_agent],
)
```

**When to use:** Any step-by-step workflow where order matters and each step may depend on previous results. Good examples: data ETL, code generation + review, research + synthesis.

---

## ParallelAgent

Runs all sub-agents concurrently. Results accumulate in session state (each sub-agent should use a unique `output_key`). The next agent in a pipeline can then synthesize all results.

```python
from google.adk.agents import ParallelAgent

research = ParallelAgent(
    name="parallel_research",
    sub_agents=[
        Agent(name="news", output_key="news_results", ...),
        Agent(name="trends", output_key="trend_results", ...),
        Agent(name="social", output_key="social_results", ...),
    ],
)

synthesizer = Agent(
    name="synthesizer",
    instruction="Combine these research results:\n\nNews: {news_results}\n\nTrends: {trend_results}\n\nSocial: {social_results}",
)

pipeline = SequentialAgent(
    name="full_research",
    sub_agents=[research, synthesizer],
)
```

**When to use:** Independent tasks that don't depend on each other's output — parallel API calls, simultaneous research streams, concurrent data fetches.

---

## LoopAgent

Runs its sub-agents repeatedly until a stop signal is emitted or `max_iterations` is reached. The sub-agent (or a tool it calls) must call `actions.escalate = True` in the tool context to terminate the loop.

```python
from google.adk.agents import LoopAgent

refinement_loop = LoopAgent(
    name="refinement_loop",
    sub_agents=[refine_agent],
    max_iterations=5,
)
```

**Termination from a tool:**
```python
from google.adk.tools import ToolContext

def check_quality(score: float, tool_context: ToolContext) -> dict:
    """Check if quality meets the threshold and stop the loop if so."""
    if score >= 0.9:
        tool_context.actions.escalate = True  # stops the loop
    return {"score": score, "acceptable": score >= 0.9}
```

**When to use:** Iterative refinement (rewrite until good enough), retry logic, polling until a condition is met.

---

## BaseAgent (Custom Agents)

Gives you full control over execution logic. Override `_run_async_impl` to implement any orchestration pattern.

```python
from google.adk.agents.base_agent import BaseAgent
from google.adk.agents.invocation_context import InvocationContext
from google.adk.events import Event
from typing import AsyncGenerator

class MyCustomAgent(BaseAgent):
    def __init__(self, sub_agents, **kwargs):
        super().__init__(sub_agents=sub_agents, **kwargs)

    async def _run_async_impl(
        self, ctx: InvocationContext
    ) -> AsyncGenerator[Event, None]:
        # Call sub-agents manually, implement conditional branching,
        # mix workflow types, etc.
        async for event in self.sub_agents[0].run_async(ctx):
            yield event
```

**When to use:** When none of the built-in workflow agents match your needs — e.g., conditional branching between sub-agents, dynamic sub-agent selection based on input, complex retry logic.

---

## Multi-Agent Routing Patterns

### LLM-driven routing (autonomous delegation)

The coordinator's LLM reads sub-agent descriptions and decides which to call. Works well when routing intent is semantically clear.

```python
root = Agent(
    name="coordinator",
    instruction="Route user requests to the right specialist.",
    sub_agents=[billing_agent, support_agent, sales_agent],
)
```

### Explicit tool routing (AgentTool)

The parent explicitly calls a sub-agent like a tool — useful when you want control over *when* the sub-agent is invoked and what it receives.

```python
from google.adk.tools.agent_tool import AgentTool

root = Agent(
    name="orchestrator",
    instruction="Use summarize_tool when the user asks for a summary.",
    tools=[AgentTool(agent=summarizer_agent)],
)
```

### Hybrid pattern

Use `sub_agents` for autonomous routing to specialists, and `tools` (including `AgentTool`) for deterministic single-purpose invocations.

---

## Choosing the Right Agent Type

| Situation | Agent Type |
|-----------|------------|
| LLM reasons, picks tools, routes requests | `Agent` / `LlmAgent` |
| Fixed steps in order | `SequentialAgent` |
| Independent tasks run simultaneously | `ParallelAgent` |
| Repeat until condition met | `LoopAgent` |
| Custom conditional/dynamic logic | `BaseAgent` subclass |
| Multiple specialists, LLM decides who | `Agent` with `sub_agents` |
| Sub-agent called explicitly like a function | `AgentTool` in `tools` |
