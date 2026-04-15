# Typst Advanced Patterns

## Table of Contents
1. [Document Templates](#document-templates)
2. [Show Rules Patterns](#show-rules-patterns)
3. [Counters and State](#counters-and-state)
4. [Headers and Footers](#headers-and-footers)
5. [Data Loading](#data-loading)
6. [Custom Functions](#custom-functions)
7. [LaTeX Migration](#latex-migration)
8. [Common Gotchas](#common-gotchas)

---

## Document Templates

### Academic Paper Template

```typst
#let paper(title, authors, abstract, body) = {
  set page(paper: "a4", margin: (x: 2.5cm, y: 3cm), numbering: "1")
  set text(font: "New Computer Modern", size: 11pt)
  set par(justify: true, leading: 0.65em)
  set heading(numbering: "1.")
  set math.equation(numbering: "(1)")

  // Title and authors
  align(center)[
    #text(size: 18pt, weight: "bold")[#title]
    #v(1em)
    #for (i, author) in authors.enumerate() {
      if i > 0 [ · ]
      author
    }
  ]
  v(1.5em)

  // Abstract
  block(
    width: 85%,
    inset: (x: 1em, y: 0.8em),
  )[
    #text(weight: "bold")[Abstract. ]#abstract
  ]
  v(2em)

  // TOC
  outline(depth: 2)
  pagebreak()

  body
}

#show: paper.with(
  "Title of My Paper",
  ("Author One", "Author Two"),
  [This paper investigates...],
)
```

### Letter Template

```typst
#let letter(sender, recipient, date, subject, body) = {
  set page(paper: "a4", margin: (x: 2.5cm, y: 3cm))
  set text(font: "Linux Libertine", size: 11pt)

  // Sender header
  align(right)[
    #sender.name \
    #sender.address \
    #sender.email
  ]
  v(2em)

  // Date and recipient
  date
  v(1em)
  recipient.name \
  recipient.address
  v(2em)

  // Subject
  text(weight: "bold")[Re: #subject]
  v(1.5em)

  // Body
  body

  // Signature
  v(3em)
  [Sincerely,]
  v(2em)
  sender.name
}
```

### CV/Resume Template

```typst
#let cv-entry(date, role, org, details) = grid(
  columns: (3cm, 1fr),
  gutter: 1em,
  text(size: 9pt, fill: luma(100))[#date],
  [
    #text(weight: "bold")[#role] — #org \
    #details
  ],
)

// Usage:
#cv-entry(
  [2022–2024],
  "Senior Engineer",
  "Acme Corp",
)[
  - Led team of 5 engineers
  - Shipped product X
]
```

---

## Show Rules Patterns

### Highlight specific headings

```typst
// Style only top-level headings
#show heading.where(level: 1): it => {
  v(0.8em)
  text(size: 18pt, weight: "bold", fill: navy)[#it.body]
  v(0.4em)
  line(length: 100%, stroke: navy)
}
```

### Numbered theorems / definitions

```typst
#let theorem-counter = counter("theorem")

#let theorem(name, body) = {
  theorem-counter.step()
  context block(
    width: 100%,
    fill: luma(240),
    inset: 0.8em,
    radius: 4pt,
  )[
    *Theorem #theorem-counter.display().* #if name != none [(#name)] #body
  ]
}

#theorem("Pythagoras")[
  For any right triangle, $a^2 + b^2 = c^2$.
]
```

### Callout boxes

```typst
#let callout(kind: "Note", color: blue, body) = block(
  width: 100%,
  inset: (left: 1em, rest: 0.8em),
  fill: color.lighten(85%),
  stroke: (left: 3pt + color),
  radius: (right: 4pt),
)[
  #text(weight: "bold", fill: color)[#kind]
  #parbreak()
  #body
]

// Usage:
#callout(kind: "Warning", color: orange)[
  This will delete all your data.
]
```

### Code blocks with line numbers

```typst
#show raw.where(block: true): it => {
  let lines = it.text.split("\n")
  let numbered = lines.enumerate().map(((i, line)) => {
    grid(
      columns: (2em, 1fr),
      text(fill: luma(150), size: 0.85em)[#(i + 1)],
      raw(line, lang: it.lang),
    )
  })
  block(
    fill: luma(245),
    radius: 4pt,
    inset: 0.8em,
    width: 100%,
  )[#numbered.join()]
}
```

---

## Counters and State

### Custom counter with step + display

```typst
#let ex-counter = counter("example")

#let example(body) = {
  ex-counter.step()
  context block[
    *Example #ex-counter.display("1").*
    #body
  ]
}
```

### Section-aware page header

```typst
#set page(header: context {
  let headings = query(heading.where(level: 1).before(here()))
  let current = if headings.len() > 0 { headings.last().body } else { [] }
  grid(
    columns: (1fr, 1fr),
    align: (left, right),
    current,
    counter(page).display(),
  )
})
```

### Tracking state across document

```typst
// Define state with initial value
#let word-count = state("wc", 0)

// Update in document
#word-count.update(n => n + 42)

// Read at any point
#context [Total: #word-count.get() words]
```

---

## Headers and Footers

### Chapter-style header with rule

```typst
#set page(
  header: context {
    let chapters = query(heading.where(level: 1).before(here()))
    if chapters.len() > 0 {
      let chapter = chapters.last()
      grid(
        columns: (1fr, auto),
        emph(chapter.body),
        counter(page).display(),
      )
      line(length: 100%)
    }
  },
  header-ascent: 40%,
)
```

### Alternating (recto/verso) headers

```typst
#set page(header: context {
  let page-num = counter(page).get().first()
  if calc.odd(page-num) {
    // Right-hand page
    align(right)[
      #counter(page).display()
      #h(1em)
      #query(heading.where(level: 2).before(here())).last().body
    ]
  } else {
    // Left-hand page
    align(left)[
      My Document
      #h(1em)
      #counter(page).display()
    ]
  }
})
```

---

## Data Loading

### From CSV

```typst
// data.csv:
// Name,Score,Grade
// Alice,95,A

#let data = csv("data.csv")
#let headers = data.first()
#let rows = data.slice(1)

#table(
  columns: headers.len(),
  ..headers.map(h => text(weight: "bold")[#h]),
  ..rows.flatten(),
)
```

### From JSON

```typst
#let config = json("config.json")
// config.json: {"title": "My Doc", "author": "Jane"}

#config.title — by #config.author
```

### From YAML

```typst
#let metadata = yaml("front-matter.yml")
```

### From TOML

```typst
#let settings = toml("settings.toml")
```

---

## Custom Functions

### Utility functions

```typst
// Conditional content
#let when(cond, content) = if cond { content } else { none }

// Separator
#let sep = line(length: 100%, stroke: luma(200))

// Badge / tag
#let badge(label, color: blue) = box(
  inset: (x: 0.4em, y: 0.2em),
  fill: color.lighten(70%),
  stroke: color,
  radius: 3pt,
)[#text(size: 0.8em, fill: color)[#label]]

// Usage:
#badge("NEW", color: green)
#badge("DEPRECATED", color: red)
```

### Recursive functions

```typst
// Factorial
#let fact(n) = if n <= 1 { 1 } else { n * fact(n - 1) }

// Fibonacci
#let fib(n) = if n <= 2 { 1 } else { fib(n - 1) + fib(n - 2) }

// Table of values
#table(
  columns: 8,
  ..range(1, 9).map(n => $F_#n$),
  ..range(1, 9).map(n => str(fib(n))),
)
```

### Array operations

```typst
#let nums = (3, 1, 4, 1, 5, 9, 2, 6)

// Map
#nums.map(n => n * 2)

// Filter
#nums.filter(n => n > 3)

// Reduce
#nums.fold(0, (acc, n) => acc + n)

// Sort
#nums.sorted()
#nums.sorted(key: n => -n)  // reverse

// Join as content
#nums.map(n => str(n)).join(", ")
```

---

## LaTeX Migration

| LaTeX | Typst |
|-------|-------|
| `\textbf{text}` | `*text*` or `#strong[text]` |
| `\textit{text}` | `_text_` or `#emph[text]` |
| `\section{Title}` | `= Title` |
| `\subsection{T}` | `== T` |
| `\begin{itemize}...\item` | `- item` |
| `\begin{enumerate}...\item` | `+ item` |
| `\begin{equation}` | `$ ... $` (block) |
| `\frac{a}{b}` | `a/b` or `frac(a, b)` |
| `\sqrt{x}` | `sqrt(x)` |
| `\sum_{i=1}^{n}` | `sum_(i=1)^n` |
| `\int_a^b` | `integral_a^b` |
| `\alpha` | `alpha` |
| `\mathbb{R}` | `RR` |
| `\label{fig:x}` | `<fig:x>` |
| `\ref{fig:x}` | `@fig:x` |
| `\cite{key}` | `@key` |
| `\bibliography{refs}` | `#bibliography("refs.bib")` |
| `\usepackage{pkg}` | `#import "@preview/pkg:ver"` |
| `\newcommand{\cmd}{def}` | `#let cmd = [def]` |
| `\begin{figure}...\end{figure}` | `#figure(...)` |
| `\begin{table}...\end{table}` | `#figure(table(...))` |
| `\hspace{1cm}` | `#h(1cm)` |
| `\vspace{1cm}` | `#v(1cm)` |
| `\noindent` | `#set par(first-line-indent: 0pt)` |
| `\clearpage` | `#pagebreak()` |
| `\textcolor{red}{text}` | `#text(fill: red)[text]` |
| `\colorbox{yellow}{text}` | `#highlight(fill: yellow)[text]` |

### Key differences from LaTeX

1. **No preamble** — just start writing; configuration via `#set` rules anywhere
2. **No backslash** for common things — `*bold*`, `_italic_`, `= Heading`
3. **Consistent functions** — everything is `function(param: value)[content]`
4. **Real scripting** — not TeX macros; proper loops, conditionals, recursion
5. **Fast compile** — milliseconds, not seconds; incremental by default
6. **Readable errors** — Typst points to the exact line and explains the problem
7. **Math identifiers** — multi-letter names are Typst identifiers, not text (use `"text"` for labels in math)

---

## Common Gotchas

### Content vs strings

```typst
// This is a string:
#let x = "hello"

// This is content:
#let x = [hello]

// You can't directly concatenate content and strings the same way:
#let msg = "Score: " + str(score)    // string concat
#let msg = [Score: #score]           // content with interpolation
```

### Context requirement

Some values are only available inside a `context` expression:

```typst
// ERROR: counter value not available outside context
#counter(page).display()  // this actually works for display

// But for calculations you need context:
#context {
  let page = counter(page).get().first()
  if page > 10 [Long document] else [Short document]
}
```

### Set rules scope

Set rules apply from the point they're declared until end of scope:

```typst
// Global set rule (applies to whole document if at top level)
#set text(size: 12pt)

// Scoped set rule (only inside this block)
#{
  set text(fill: red)
  [This is red]
}
[This is back to normal color]
```

### Function calls vs content blocks

```typst
// These are equivalent:
#rect(fill: blue)[content]
#rect(fill: blue, body: [content])

// Trailing content block is sugar for the last positional/body argument
#align(center)[Centered content]
// same as:
#align(center, [Centered content])
```

### Array indexing

```typst
#let arr = (10, 20, 30)
#arr.at(0)      // 10
#arr.first()    // 10
#arr.last()     // 30
#arr.at(-1)     // error — no negative indexing; use arr.last()
```

### Import vs include

```typst
// import: brings definitions into scope
#import "utils.typ": my-func
#my-func()

// include: inserts the rendered content of a file
#include "chapter1.typ"  // equivalent to pasting chapter1.typ's output here
```
