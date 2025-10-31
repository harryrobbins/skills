---
name: mermaidjs
description: Create and render Mermaid diagrams of all types (flowcharts, sequence diagrams, ERDs, Gantt charts, class diagrams, state diagrams, etc.) with text-based syntax. Use when users request diagram creation, visualization of processes/workflows/architectures, or need to convert concepts into visual diagrams. Supports rendering to SVG, PNG, and PDF formats, and can create markdown documentation with embedded or pre-rendered diagrams.
---

# MermaidJS Skill

## Overview

Create diagrams and visualizations using Mermaid's text-based syntax, supporting 20+ diagram types including flowcharts, sequence diagrams, entity relationship diagrams, Gantt charts, class diagrams, state machines, and more. Render diagrams to multiple output formats (SVG, PNG, PDF) and generate markdown documentation with embedded visualizations.

## When to Use This Skill

Use this skill when users request:
- Creating any type of diagram or visualization
- Visualizing processes, workflows, or system architectures
- Database schemas or data models (ERDs)
- Project timelines or schedules (Gantt charts)
- Sequence flows or API interactions
- State machines or lifecycle diagrams
- System architecture or component relationships
- Organizational charts or hierarchies
- Any request involving "diagram", "chart", "visualize", "flowchart", etc.

## Core Capabilities

### 1. Diagram Creation

Create diagrams using Mermaid's text-based syntax. The skill supports all Mermaid diagram types:

**Common diagram types:**
- **Flowcharts** - Process flows, decision trees, workflows
- **Sequence Diagrams** - API calls, interaction flows, communication sequences
- **Entity Relationship Diagrams (ERD)** - Database schemas, data models
- **Class Diagrams** - Object-oriented design, UML diagrams
- **State Diagrams** - State machines, lifecycle flows
- **Gantt Charts** - Project timelines, schedules, task planning
- **Git Graphs** - Branch visualization, version control workflows

**Additional types:** User journeys, mindmaps, pie charts, quadrant charts, XY charts, timelines, Sankey diagrams, C4 architecture diagrams, requirement diagrams, kanban boards, and more.

**Syntax reference:** Consult `references/diagram_types.md` for comprehensive syntax examples, use cases, and best practices for each diagram type. Use grep pattern `## <DiagramType>` to find specific diagram types quickly.

### 2. Rendering to Multiple Formats

Render diagrams to various output formats using the `scripts/render_diagram.py` script, which wraps the mermaid-cli tool (mmdc).

**Basic rendering workflow:**

1. Create a `.mmd` file containing the Mermaid diagram code
2. Use `scripts/render_diagram.py` to render to desired format:

```bash
python scripts/render_diagram.py diagram.mmd -o output.svg
```

**Supported formats:**
- **SVG** (vector, recommended for web/docs) - default format
- **PNG** (raster, good for presentations/images)
- **PDF** (document format, good for printing)

**Common rendering options:**

```bash
# Dark theme with transparent background
python scripts/render_diagram.py diagram.mmd -o diagram.png --theme dark --background transparent

# Custom dimensions
python scripts/render_diagram.py diagram.mmd -o diagram.png --width 1920 --height 1080

# Apply custom styling
python scripts/render_diagram.py diagram.mmd -o diagram.svg --css custom-styles.css
```

**Themes available:** `default`, `dark`, `forest`, `neutral`

**Installation check:** The script automatically checks if mermaid-cli is installed and provides installation instructions if needed. Users need to run `npm install -g @mermaid-js/mermaid-cli` first.

### 3. Creating Markdown Documentation

Generate markdown files with embedded Mermaid diagrams using `scripts/create_markdown_with_diagram.py`.

**Two modes of operation:**

**Mode 1: Inline Mermaid code blocks** (rendered by markdown viewers that support Mermaid)
```bash
python scripts/create_markdown_with_diagram.py -i diagram.mmd -o docs.md --title "System Architecture"
```

**Mode 2: Pre-rendered SVG embedded** (works in all markdown viewers)
```bash
python scripts/create_markdown_with_diagram.py -i diagram.mmd -o docs.md --render --theme dark
```

**Usage with description:**
```bash
python scripts/create_markdown_with_diagram.py \
  -i workflow.mmd \
  -o workflow.md \
  --title "Deployment Workflow" \
  --description "This diagram shows our CI/CD pipeline" \
  --render \
  --background transparent
```

**Reading from stdin:**
```bash
echo "graph TD; A-->B" | python scripts/create_markdown_with_diagram.py -o quick.md --render
```

## Typical Workflows

### Workflow 1: Quick Diagram Creation

When a user requests a diagram without specific output requirements:

1. Determine the appropriate diagram type based on the request
2. Consult `references/diagram_types.md` for syntax (grep for the diagram type section)
3. Create the diagram code inline or write to a `.mmd` file
4. Present the Mermaid code to the user in a markdown code block

**Example request:** "Create a flowchart showing the login process"

**Response approach:**
- Analyze the process flow
- Reference `references/diagram_types.md` (grep: `## Flowcharts`)
- Generate Mermaid flowchart code
- Present in a ```mermaid code block

### Workflow 2: Rendered Output for Presentations

When a user needs a rendered image (PNG/SVG/PDF):

1. Create the diagram code and save to a `.mmd` file
2. Use `scripts/render_diagram.py` to render to the requested format
3. Apply appropriate theme and styling options
4. Provide the rendered file to the user

**Example request:** "Create a sequence diagram showing the API flow and export it as PNG with dark theme"

**Response approach:**
- Create sequence diagram code
- Save to `api_flow.mmd`
- Run: `python scripts/render_diagram.py api_flow.mmd -o api_flow.png --theme dark --background transparent`
- Deliver `api_flow.png`

### Workflow 3: Documentation with Diagrams

When a user needs documentation with embedded diagrams:

1. Create the diagram code
2. Decide between inline Mermaid (for GitHub/modern viewers) or pre-rendered SVG (universal compatibility)
3. Use `scripts/create_markdown_with_diagram.py` with appropriate options
4. Optionally create multiple diagrams and combine in a single document

**Example request:** "Create documentation for our database schema with diagrams"

**Response approach:**
- Create ERD diagram(s) for the schema
- Use `create_markdown_with_diagram.py` with `--render` for compatibility
- Add title and description for context
- Deliver complete markdown file with embedded visualization

### Workflow 4: Complex Multi-Diagram Documentation

When a user needs comprehensive documentation with multiple diagrams:

1. Create individual `.mmd` files for each diagram
2. Render each diagram to SVG using `scripts/render_diagram.py`
3. Manually compose a markdown document that references all SVG files
4. Organize diagrams logically within the documentation structure

**Example request:** "Create a complete architecture document with system context, container, and component diagrams"

**Response approach:**
- Create separate `.mmd` files: `context.mmd`, `container.mmd`, `component.mmd`
- Render each: `python scripts/render_diagram.py <file>.mmd -o <file>.svg`
- Create comprehensive markdown document with sections for each diagram
- Embed SVG references: `![Context Diagram](context.svg)`

## Best Practices

### Diagram Design
- Keep diagrams focused and not overly complex (split into multiple diagrams if needed)
- Use clear, descriptive labels for nodes and relationships
- Apply consistent naming conventions within a diagram
- Choose the right diagram type for the use case (consult `references/diagram_types.md`)

### Styling and Themes
- Use `dark` theme for presentations with dark backgrounds
- Use `transparent` background when overlaying on custom backgrounds
- Apply custom CSS for organization-specific branding requirements
- Use inline styles sparingly (prefer theme-based styling for consistency)

### File Organization
- Name `.mmd` files descriptively (e.g., `user-authentication-flow.mmd`)
- Keep diagram source files alongside documentation for version control
- Render to SVG for web/documentation (vector, scalable)
- Render to PNG for presentations or when raster format is required
- Include both `.mmd` source and rendered output in version control

### Documentation Integration
- Use inline Mermaid code blocks for GitHub/GitLab/modern platforms (they render automatically)
- Use pre-rendered SVG when universal compatibility is required
- Always include diagram titles and descriptions for context
- Consider accessibility: provide alt text for rendered images

## Resources

### scripts/render_diagram.py
Python script that wraps mermaid-cli to render diagrams to SVG, PNG, or PDF formats. Provides convenient command-line interface with support for themes, backgrounds, custom dimensions, and styling options.

Run `python scripts/render_diagram.py --help` for complete usage information.

### scripts/create_markdown_with_diagram.py
Python script to generate markdown documentation with embedded Mermaid diagrams. Supports both inline Mermaid code blocks and pre-rendered SVG embedding.

Run `python scripts/create_markdown_with_diagram.py --help` for complete usage information.

### references/diagram_types.md
Comprehensive reference guide for all Mermaid diagram types, including syntax examples, use cases, node shapes, relationship types, and styling options. Consult this file when creating any diagram to ensure correct syntax.

Use grep patterns like `## Flowcharts`, `## Sequence Diagrams`, `## Entity Relationship Diagrams` to quickly find specific diagram type documentation.

## Dependencies

This skill requires mermaid-cli (mmdc) for rendering diagrams:

```bash
# Install globally (recommended)
npm install -g @mermaid-js/mermaid-cli

# Verify installation
mmdc --version
```

**Alternative installation methods:**
- Using npx (no installation): `npx -p @mermaid-js/mermaid-cli mmdc -i input.mmd -o output.svg`
- Using Docker: `docker pull minlag/mermaid-cli`

The `scripts/render_diagram.py` script will automatically detect if mermaid-cli is not installed and provide installation instructions.
