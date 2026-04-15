---
name: typst
description: Use this skill whenever the user wants to write, create, edit, or compile Typst documents (.typ files). Typst is a modern markup-based typesetting system — an alternative to LaTeX — used to produce PDFs, academic papers, reports, templates, and scientific documents with math. Trigger whenever the user mentions .typ files, typst compile, typst watch, set rules, show rules, Typst templates, or asks how to format a document in Typst. Also trigger when the user is clearly writing a document that would benefit from Typst's math, layout, or scripting features, even if they don't say "Typst" explicitly.
---

# Typst Skill

Typst is a markup-based typesetting system that compiles `.typ` files to PDF (also PNG, SVG, HTML). It combines simple markup, a tightly integrated scripting language, and fast incremental compilation.

## Quick Start

```bash
# Compile to PDF
typst compile file.typ

# Watch and recompile on save
typst watch file.typ

# Compile to specific output path
typst compile src/doc.typ out/doc.pdf

# List available fonts
typst fonts
```

## Three Modes

Typst has three syntactic modes — understanding when you're in each is the key to reading and writing Typst fluently.

| Mode | How to enter | Purpose |
|------|-------------|---------|
| **Markup** | Default | Write text with lightweight formatting syntax |
| **Code** | Prefix with `#` | Scripting: variables, functions, logic |
| **Math** | Wrap with `$...$` | Mathematical equations |

Once inside a `#` expression, you stay in code mode until that expression ends — no extra `#` needed for nested calls.

## Markup Syntax

```typst
= Top-level heading
== Subheading
=== Sub-subheading

*bold text*        // strong
_italic text_      // emph
`inline code`      // raw

- Bullet item      // list
+ Numbered item    // enum
/ Term: definition // terms

https://typst.app  // auto-linked URL
@label-name        // cross-reference or citation
<label-name>       // attach a label to content

\                  // line break
---                // em dash
~                  // non-breaking space
// line comment
/* block comment */
```

## Code Mode (Scripting)

```typst
// Variables
#let name = "Typst"
#let count = 8

// Functions
#let greet(who) = [Hello, #who!]
#greet("World")

// Conditionals
#if count > 5 [Many items] else [Few items]

// For loop
#for i in range(1, 4) [
  Item #i.
]

// Content blocks (markup inside code)
#let title = [*My Document*]

// Code blocks (execute multiple statements)
#{
  let x = 1
  let y = 2
  x + y
}

// Destructuring
#let (a, b) = (1, 2)
#let (first, ..rest) = (1, 2, 3, 4)
```

## Math Mode

```typst
// Inline math (no surrounding spaces)
The value $x^2 + y^2 = r^2$ is well known.

// Block-level math (spaces inside $)
$ sum_(i=1)^n i = (n(n+1))/2 $

// Common patterns
$F_n = round(1/sqrt(5) phi.alt^n)$   // subscripts, fractions, symbols
$vec(a, b, c)$                        // vectors
$mat(1, 0; 0, 1)$                     // matrices
$integral_0^1 f(x) dif x$            // integrals
$abs(x) = cases(x "if" x >= 0, -x "if" x < 0)$  // cases

// Text inside math
$a "is greater than" b$

// Multi-letter identifiers are Typst names, not variables
// Use quotes for text: "max", "if"
// Built-in: sin, cos, tan, sqrt, floor, ceil, abs, lim, etc.
```

## Styling: Set Rules & Show Rules

Set rules configure element properties globally (until end of scope):

```typst
// Page setup
#set page(
  paper: "a4",
  margin: (x: 2.5cm, y: 3cm),
  numbering: "1",
  header: align(right)[My Document],
)

// Text
#set text(
  font: "New Computer Modern",
  size: 11pt,
  lang: "en",
)

// Paragraphs
#set par(justify: true, leading: 0.8em)

// Headings
#set heading(numbering: "1.1")
```

Show rules transform how elements render:

```typst
// Show-set: apply properties to a subset
#show heading.where(level: 1): set text(fill: navy)

// Transformational: completely redefine appearance
#show heading: it => [
  #set text(weight: "bold")
  #it.body — Level #it.level
]

// Show a string replacement
#show "TeX": "Typst"

// Show regex
#show regex("\d+"): it => text(fill: red, it)

// Apply to whole document
#show: body => {
  set text(font: "Linux Libertine")
  body
}
```

## Common Document Patterns

### Basic document with template

```typst
// Define a template function
#let doc-template(title, author, body) = {
  set page(paper: "a4", margin: 2.5cm, numbering: "1")
  set text(font: "New Computer Modern", size: 11pt)
  set par(justify: true)
  set heading(numbering: "1.")

  // Title block
  align(center)[
    #text(size: 20pt, weight: "bold")[#title]
    #v(0.5em)
    #text(size: 12pt)[#author]
  ]
  v(2em)

  body
}

// Apply template to rest of document
#show: doc-template.with("My Paper", "Jane Smith")

= Introduction
Content goes here...
```

### Table of contents

```typst
#outline()

// Customized
#outline(
  title: "Contents",
  depth: 2,
  indent: 1em,
)
```

### Figures and captions

```typst
#figure(
  image("diagram.png", width: 80%),
  caption: [Diagram showing the relationship.],
) <fig:diagram>

As shown in @fig:diagram, ...
```

### Tables

```typst
#table(
  columns: (auto, 1fr, 1fr),
  table.header([Name], [Score], [Grade]),
  [Alice], [95], [A],
  [Bob],   [82], [B],
)

// Styled table
#show table.cell.where(y: 0): strong  // bold header row
```

### Bibliography

```typst
// At end of document
#bibliography("refs.bib")

// Cite inline
As shown by @smith2023, ...

// Customize style
#set cite(style: "ieee")
#bibliography("refs.bib", style: "ieee")
```

### Page numbers and headers/footers

```typst
#set page(
  header: context {
    let chapters = query(heading.where(level: 1))
    // ... use chapters for section-aware headers
    align(right)[My Document]
  },
  footer: context align(center)[
    #counter(page).display("1 of 1", both: true)
  ],
)
```

### Multi-column layout

```typst
#columns(2)[
  This text flows in two columns. When it fills one column,
  it automatically wraps to the next.
]
```

## Modules and Packages

```typst
// Import from another file
#import "utils.typ": greet, format-date
#import "utils.typ"  // access as utils.greet()

// Include another file (inserts its content)
#include "chapter1.typ"

// Use a package from Typst Universe
#import "@preview/codelst:2.0.0": sourcecode
```

## Context System

Context is needed when content must react to its position in the document:

```typst
// Access counter values
#context counter(heading).get()

// Query for elements
#context {
  let headings = query(heading)
  headings.len()
}

// Current page number
#context counter(page).display()
```

## Key Types

| Type | Examples | Notes |
|------|---------|-------|
| `none` | `none` | Absence of value |
| `bool` | `true`, `false` | |
| `int` | `42`, `0xff` | |
| `float` | `3.14`, `1e5` | |
| `str` | `"hello"` | Unicode strings |
| `length` | `2pt`, `1cm`, `1em` | Absolute or relative |
| `ratio` | `50%` | Percentage |
| `content` | `[*bold*]` | Rendered markup |
| `array` | `(1, 2, 3)` | Zero-indexed |
| `dict` | `(a: 1, b: 2)` | Key-value pairs |
| `color` | `red`, `rgb(255,0,0)` | |

## Reference Files

- **`references/syntax-reference.md`** — Complete syntax tables for markup, math, and code modes; operator precedence; escape sequences
- **`references/patterns.md`** — Advanced patterns: custom show rules, counters, state, introspection, data loading, LaTeX migration tips
