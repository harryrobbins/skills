# Mermaid Diagram Types Reference

This document provides syntax examples and use cases for all Mermaid diagram types.

## Flowcharts

**Use for:** Process flows, decision trees, workflows

**Basic syntax:**
```mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E
```

**Direction options:** `TD` (top-down), `LR` (left-right), `BT` (bottom-top), `RL` (right-left)

**Node shapes:**
- `[Rectangle]` - Standard box
- `(Rounded)` - Rounded corners
- `([Stadium])` - Pill shape
- `[[Subroutine]]` - Double border
- `[(Database)]` - Cylinder
- `((Circle))` - Circle
- `{Diamond}` - Diamond (decision)
- `{{Hexagon}}` - Hexagon
- `[/Parallelogram/]` - Parallelogram
- `[\Parallelogram\]` - Reverse parallelogram
- `[/Trapezoid\]` - Trapezoid

## Sequence Diagrams

**Use for:** Interaction sequences, API calls, communication flows

**Basic syntax:**
```mermaid
sequenceDiagram
    participant A as Alice
    participant B as Bob
    A->>B: Hello Bob!
    B->>A: Hi Alice!
    Note right of B: Bob thinks
    B-->>A: How are you?
```

**Arrow types:**
- `->` Solid line without arrow
- `-->` Dotted line without arrow
- `->>` Solid line with arrow
- `-->>` Dotted line with arrow
- `-x` Solid line with cross
- `--x` Dotted line with cross

**Features:** `activate`/`deactivate`, `loop`, `alt`/`else`, `opt`, `par`, `rect`

## Class Diagrams

**Use for:** Object-oriented design, data models, UML

**Basic syntax:**
```mermaid
classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    class Dog {
        +String breed
        +bark()
    }
    Animal <|-- Dog
```

**Relationships:**
- `<|--` Inheritance
- `*--` Composition
- `o--` Aggregation
- `-->` Association
- `--` Link (solid)
- `..>` Dependency
- `..|>` Realization

**Visibility:** `+` public, `-` private, `#` protected, `~` package

## State Diagrams

**Use for:** State machines, lifecycle flows, system states

**Basic syntax:**
```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Processing: start
    Processing --> Complete: finish
    Processing --> Error: fail
    Complete --> [*]
    Error --> Idle: retry
```

## Entity Relationship Diagrams (ERD)

**Use for:** Database schemas, data relationships

**Basic syntax:**
```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER {
        string name
        string email
        int customer_id
    }
    ORDER {
        int order_id
        date order_date
    }
```

**Relationships:**
- `||--||` One to one
- `||--o{` One to many
- `}o--o{` Many to many
- `||--|{` One to one or more
- `}o--||` Zero or more to one

## Gantt Charts

**Use for:** Project timelines, schedules, task planning

**Basic syntax:**
```mermaid
gantt
    title Project Schedule
    dateFormat YYYY-MM-DD
    section Planning
    Requirements    :a1, 2024-01-01, 30d
    Design         :a2, after a1, 20d
    section Development
    Implementation :2024-02-20, 40d
    Testing        :2024-04-01, 15d
```

## User Journey

**Use for:** User experience flows, customer journeys

**Basic syntax:**
```mermaid
journey
    title My Shopping Journey
    section Browse
      View Products: 5: Me
      Add to Cart: 3: Me
    section Checkout
      Enter Details: 2: Me
      Payment: 1: Me
    section Delivery
      Receive Order: 5: Me
```

## Git Graph

**Use for:** Version control workflows, branch visualization

**Basic syntax:**
```mermaid
gitGraph
    commit
    branch develop
    checkout develop
    commit
    checkout main
    merge develop
    commit
```

## Pie Charts

**Use for:** Proportional data, percentage breakdowns

**Basic syntax:**
```mermaid
pie title Distribution
    "Category A" : 42.5
    "Category B" : 30.5
    "Category C" : 27.0
```

## Quadrant Charts

**Use for:** 2x2 matrices, prioritization grids

**Basic syntax:**
```mermaid
quadrantChart
    title Effort vs Impact
    x-axis Low Effort --> High Effort
    y-axis Low Impact --> High Impact
    quadrant-1 Quick Wins
    quadrant-2 Big Bets
    quadrant-3 Fill Ins
    quadrant-4 Thankless Tasks
    Task A: [0.3, 0.8]
    Task B: [0.7, 0.9]
```

## XY Charts

**Use for:** Line graphs, bar charts, data visualization

**Basic syntax:**
```mermaid
xychart-beta
    title "Sales Over Time"
    x-axis [Jan, Feb, Mar, Apr, May]
    y-axis "Revenue" 0 --> 100
    line [20, 35, 45, 60, 75]
    bar [15, 30, 40, 55, 70]
```

## Timeline

**Use for:** Historical events, milestones

**Basic syntax:**
```mermaid
timeline
    title History of Technology
    section 1990s
        1991 : Linux Released
        1995 : JavaScript Created
    section 2000s
        2004 : Facebook Launched
        2007 : iPhone Released
```

## Mindmap

**Use for:** Brainstorming, concept organization

**Basic syntax:**
```mermaid
mindmap
  root((Central Idea))
    Topic 1
      Subtopic 1.1
      Subtopic 1.2
    Topic 2
      Subtopic 2.1
```

## Sankey Diagram

**Use for:** Flow visualization, resource allocation

**Basic syntax:**
```mermaid
sankey-beta
    Source,Target A,100
    Source,Target B,50
    Target A,Destination,80
    Target B,Destination,50
```

## C4 Diagrams

**Use for:** Software architecture (Context, Container, Component, Code)

**Basic syntax:**
```mermaid
C4Context
    title System Context
    Person(user, "User", "A user of the system")
    System(system, "Software System", "Main application")
    System_Ext(email, "Email System", "Sends emails")
    Rel(user, system, "Uses")
    Rel(system, email, "Sends emails using")
```

## Requirement Diagrams

**Use for:** Requirements traceability, specifications

**Basic syntax:**
```mermaid
requirementDiagram
    requirement req1 {
        id: 1
        text: User login required
        risk: high
        verifymethod: test
    }
    element SystemLogin {
        type: component
    }
    req1 - satisfies -> SystemLogin
```

## Architecture Diagrams

**Use for:** System architecture, infrastructure layouts

**Basic syntax:**
```mermaid
architecture-beta
    service api(server)[API Server]
    service db(database)[Database]
    api:R --> L:db
```

## Block Diagrams

**Use for:** System blocks, component layouts

**Basic syntax:**
```mermaid
block-beta
    columns 3
    A["Block A"] B["Block B"] C["Block C"]
    D["Block D"]:3
```

## Packet Diagrams

**Use for:** Network protocols, packet structure

**Basic syntax:**
```mermaid
packet-beta
    0-7: "Src Port"
    8-15: "Dst Port"
    16-31: "Sequence Number"
```

## Kanban Boards

**Use for:** Task tracking, workflow visualization

**Basic syntax:**
```mermaid
kanban
    Todo
        Task 1
        Task 2
    In Progress
        Task 3
    Done
        Task 4
```

## Styling and Theming

**Class styles:**
```mermaid
graph TD
    A[Node]:::customStyle
    classDef customStyle fill:#f9f,stroke:#333,stroke-width:4px
```

**Inline styles:**
```mermaid
graph TD
    A[Start]
    style A fill:#bbf,stroke:#333,stroke-width:2px
```
