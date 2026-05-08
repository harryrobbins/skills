# ADK Tools Reference

## Function Tools (most common)

Any Python function becomes a tool. ADK generates the JSON schema the model sees from the function's name, docstring, type hints, and default values — so all three matter.

### Anatomy of a well-defined tool

```python
def search_inventory(
    product_name: str,
    category: str = "all",
    in_stock_only: bool = False,
) -> list[dict]:
    """Search the product inventory for items matching the given criteria.

    Args:
        product_name: The product name or partial name to search for.
        category: Product category to filter by ('electronics', 'clothing', 'all').
        in_stock_only: When True, returns only items currently in stock.

    Returns:
        A list of product dicts, each with 'id', 'name', 'price', 'stock_count',
        and 'category' keys. Returns an empty list if no matches found.
    """
    # implementation
    return []
```

**What to put in the docstring:** The first line is the tool description the model uses to decide whether to call this tool. The `Args:` section describes each parameter — the model reads this when filling in values. The `Returns:` section helps the model understand what it'll get back.

**Return types:** Return dicts or lists of dicts for structured data. Return strings for simple messages. Avoid returning complex objects — serialize them first.

### Indicating errors

Return a dict with an `"error"` key rather than raising exceptions:

```python
def get_order(order_id: str) -> dict:
    """Retrieve an order by ID."""
    order = db.find(order_id)
    if not order:
        return {"error": f"Order {order_id} not found"}
    return order.to_dict()
```

---

## Tool Context

Add `tool_context: ToolContext` as the last parameter to access session state, emit artifacts, and control agent flow. ADK injects it automatically — don't include it in the docstring Args section.

```python
from google.adk.tools import ToolContext

def add_to_cart(item_id: str, quantity: int, tool_context: ToolContext) -> dict:
    """Add an item to the user's cart.

    Args:
        item_id: The product ID to add.
        quantity: Number of units to add.

    Returns:
        Updated cart summary with total item count and total price.
    """
    cart = tool_context.state.get("cart", {})
    cart[item_id] = cart.get(item_id, 0) + quantity
    tool_context.state["cart"] = cart
    return {"cart_item_count": sum(cart.values())}
```

### Stopping a loop from a tool

```python
def evaluate_result(score: float, tool_context: ToolContext) -> dict:
    """Evaluate the quality score and stop refinement if acceptable."""
    if score >= 0.9:
        tool_context.actions.escalate = True  # exits a LoopAgent
    return {"score": score, "quality": "acceptable" if score >= 0.9 else "needs_work"}
```

---

## Built-in Tools

```python
from google.adk.tools import google_search, code_execution

root_agent = Agent(
    name="research_agent",
    model="gemini-2.5-flash",
    instruction="Research topics and execute code as needed.",
    tools=[google_search, code_execution],
)
```

- **`google_search`** — performs Google web searches
- **`code_execution`** — runs Python code in a sandbox; useful for data analysis, calculations

---

## MCP Tools

Connect to any MCP (Model Context Protocol) server to use its tools.

### stdio transport (local process)

```python
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset, StdioServerParameters

mcp_tools = MCPToolset(
    connection_params=StdioServerParameters(
        command="npx",
        args=["-y", "@modelcontextprotocol/server-filesystem", "/home/user/data"],
    )
)

root_agent = Agent(
    name="file_agent",
    model="gemini-2.5-flash",
    instruction="Help users manage files.",
    tools=[mcp_tools],
)
```

### HTTP/SSE transport (remote server)

```python
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset, SseServerParams

mcp_tools = MCPToolset(
    connection_params=SseServerParams(url="http://localhost:8080/mcp")
)
```

### Filtering tools from an MCP server

```python
mcp_tools = MCPToolset(
    connection_params=...,
    tool_filter=["read_file", "write_file", "list_directory"],  # only these tools
)
```

---

## Agent-as-Tool (AgentTool)

Wrap a sub-agent so the parent can call it explicitly as a named tool, rather than via autonomous routing.

```python
from google.adk.tools.agent_tool import AgentTool

summarizer = Agent(
    name="summarizer",
    model="gemini-2.5-flash",
    instruction="Summarize the provided text concisely in 3 bullet points.",
)

root_agent = Agent(
    name="document_assistant",
    model="gemini-2.5-flash",
    instruction="Help users understand documents. Use the summarizer tool when they ask for a summary.",
    tools=[AgentTool(agent=summarizer)],
)
```

---

## Long-Running Tools

For tools that take minutes (e.g., batch jobs, external approvals), use `LongRunningFunctionTool`. It returns an intermediate response immediately and lets the agent check for completion later.

```python
from google.adk.tools import LongRunningFunctionTool

def start_data_export(report_id: str) -> dict:
    """Initiate a data export job. Returns immediately with a job_id to poll.

    Args:
        report_id: ID of the report to export.

    Returns:
        Dict with 'job_id' — pass this to check_export_status.
    """
    job_id = export_service.submit(report_id)
    return {"job_id": job_id, "status": "started"}

export_tool = LongRunningFunctionTool(func=start_data_export)

root_agent = Agent(
    name="export_agent",
    tools=[export_tool, check_export_status],
)
```

---

## Tool Confirmation (Human-in-the-Loop)

Return a special dict to pause execution and ask the user before proceeding with a sensitive action:

```python
from google.adk.tools import ToolContext

def process_refund(order_id: str, amount: float, tool_context: ToolContext) -> dict:
    """Process a refund for an order.

    Args:
        order_id: The order ID to refund.
        amount: The refund amount in USD.

    Returns:
        Confirmation of the refund or a confirmation request.
    """
    # Request user confirmation before taking the action
    return {
        "pending_confirmation": True,
        "message": f"Confirm refund of ${amount:.2f} for order {order_id}?",
        "action": "process_refund",
        "params": {"order_id": order_id, "amount": amount},
    }
```

---

## Vertex AI Search / RAG Tools

```python
from google.adk.tools import VertexAiSearchTool

search_tool = VertexAiSearchTool(
    data_store_id="projects/my-project/locations/global/collections/default_collection/dataStores/my-store"
)

root_agent = Agent(
    name="rag_agent",
    model="gemini-2.5-flash",
    instruction="Answer questions based on the knowledge base.",
    tools=[search_tool],
)
```

---

## Best Practices

**One responsibility per tool** — tools that do too many things are harder for the model to call correctly.

**Make tools stateless when possible** — side effects should be intentional; use tool context state for things that need to persist.

**Test tools in isolation** — call them as regular Python functions before connecting to an agent.

**Return enough context** — if a tool returns `{"success": True}`, the agent has nothing useful to say to the user. Return relevant details.

**Fail gracefully** — use `{"error": "..."}` returns rather than exceptions; uncaught exceptions can crash the agent turn.
