# Typst Syntax Reference

## Table of Contents
1. [Markup Mode Syntax](#markup-mode-syntax)
2. [Math Mode Syntax](#math-mode-syntax)
3. [Code Mode Syntax](#code-mode-syntax)
4. [Operators](#operators)
5. [Escape Sequences](#escape-sequences)
6. [Built-in Math Symbols](#built-in-math-symbols)
7. [Common Functions Reference](#common-functions-reference)

---

## Markup Mode Syntax

| Element | Syntax | Function equivalent |
|---------|--------|-------------------|
| Paragraph break | Blank line | `parbreak()` |
| Strong | `*strong*` | `strong()` |
| Emphasis | `_emphasis_` | `emph()` |
| Raw/code | `` `code` `` | `raw()` |
| Code block | ` ```lang ... ``` ` | `raw(block: true)` |
| Link | `https://example.com` | `link()` |
| Named link | `#link("url")[text]` | `link()` |
| Label | `<label>` | `label()` |
| Reference | `@label` | `ref()` |
| Citation | `@bibkey` | `cite()` |
| Heading 1 | `= Title` | `heading(level: 1)` |
| Heading 2 | `== Section` | `heading(level: 2)` |
| Heading 3 | `=== Subsection` | `heading(level: 3)` |
| Bullet list | `- item` | `list()` |
| Nested list | `  - nested` | (indent with spaces) |
| Numbered list | `+ item` | `enum()` |
| Term list | `/ Term: desc` | `terms()` |
| Line break | `\` | `linebreak()` |
| Non-breaking space | `~` | `sym.space.nobreak` |
| Em dash | `---` | `sym.dash.em` |
| En dash | `--` | `sym.dash.en` |
| Smart quote | `'...'` or `"..."` | `smartquote()` |
| Code expression | `#expr` | any code |
| Comment (line) | `// text` | ignored |
| Comment (block) | `/* text */` | ignored |

---

## Math Mode Syntax

| Element | Syntax | Notes |
|---------|--------|-------|
| Inline | `$x^2$` | No spaces inside `$` |
| Block | `$ x^2 $` | Spaces inside `$` |
| Subscript | `$x_i$` or `$x_(ij)$` | |
| Superscript | `$x^2$` or `$x^(2n)$` | |
| Fraction | `$a/b$` or `$(a+b)/(c+d)$` | `frac(a, b)` |
| Square root | `$sqrt(x)$` | |
| Nth root | `$root(n, x)$` | |
| Absolute value | `$abs(x)$` | |
| Floor/ceiling | `$floor(x)$`, `$ceil(x)$` | |
| Vector | `$vec(a, b, c)$` | |
| Matrix | `$mat(a, b; c, d)$` | `;` separates rows |
| Cases | `$cases(a "if" p, b "if" q)$` | |
| Sum | `$sum_(i=1)^n i$` | |
| Product | `$product_(i=1)^n i$` | |
| Integral | `$integral_a^b f(x) dif x$` | |
| Limit | `$lim_(x -> 0) sin(x)/x$` | |
| Binomial | `$binom(n, k)$` | |
| Alignment | `$x &= 2 \ &= 3$` | `&` aligns, `\` newline |
| Text in math | `$a "is" b$` | Quoted text |
| Bold in math | `$bold(x)$` | |
| Upright | `$upright(A)$` | |
| Symbol | `$pi$`, `$alpha$`, `$arrow.r$` | |
| Code in math | `$#var$` | Access code variables |

### Common Math Symbols

| Symbol | Typst | Symbol | Typst |
|--------|-------|--------|-------|
| α | `alpha` | ∞ | `infinity` |
| β | `beta` | ∂ | `partial` |
| γ | `gamma` | ∇ | `nabla` |
| δ | `delta` | ∈ | `in` |
| ε | `epsilon` | ∉ | `in.not` |
| θ | `theta` | ⊆ | `subset.eq` |
| λ | `lambda` | ∪ | `union` |
| μ | `mu` | ∩ | `inter` |
| π | `pi` | → | `arrow.r` |
| σ | `sigma` | ← | `arrow.l` |
| τ | `tau` | ↔ | `arrow.l.r` |
| φ | `phi` | ⇒ | `arrow.r.double` |
| ψ | `psi` | ⟺ | `arrow.l.r.double` |
| ω | `omega` | ≤ | `lt.eq` |
| Δ | `Delta` | ≥ | `gt.eq` |
| Σ | `Sigma` | ≠ | `eq.not` |
| Π | `Pi` | ≈ | `approx` |
| ℝ | `RR` | ∀ | `forall` |
| ℤ | `ZZ` | ∃ | `exists` |
| ℕ | `NN` | ¬ | `not` |
| ℂ | `CC` | ⊕ | `xor` |

---

## Code Mode Syntax

| Element | Syntax | Notes |
|---------|--------|-------|
| None | `none` | Absence of value |
| Auto | `auto` | Context-dependent default |
| Boolean | `true`, `false` | |
| Integer | `10`, `0xff`, `0o7`, `0b1` | Hex, octal, binary |
| Float | `3.14`, `1e5`, `1.2e-3` | |
| Length | `2pt`, `3mm`, `1cm`, `1em`, `2in` | |
| Angle | `90deg`, `1rad` | |
| Fraction | `2fr` | Grid fractions |
| Ratio | `50%` | |
| String | `"hello\nworld"` | Escape sequences apply |
| Content | `[*bold* text]` | Markup block |
| Array | `(1, 2, 3)` | Comma-separated |
| Dict | `(key: val, b: 2)` | Trailing comma ok |
| Function call | `rect(width: 2cm)` | Named params |
| Closure | `x => x * 2` | |
| Let binding | `let x = expr` | |
| Destructure | `let (a, b) = arr` | |
| Assignment | `x = expr`, `x += 1` | |
| If | `if cond { } else { }` | |
| For | `for x in arr { }` | |
| While | `while cond { }` | |
| Break | `break` | In loops |
| Continue | `continue` | In loops |
| Return | `return expr` | In functions |
| Field access | `value.field` | |
| Method call | `"hello".len()` | |
| Index | `arr.at(0)` or `arr.first()` | |
| Spread | `..arr` | Unpack array into args |
| Import | `import "file.typ"` | |
| Import items | `import "file.typ": a, b` | |
| Include | `include "file.typ"` | Returns content |
| Package | `import "@preview/pkg:1.0.0"` | Typst Universe |

---

## Operators

Arithmetic: `+`, `-`, `*`, `/`

Comparison: `==`, `!=`, `<`, `<=`, `>`, `>=`

Logical: `not`, `and`, `or`

Membership: `in`, `not in` (for arrays and strings)

Assignment: `=`, `+=`, `-=`, `*=`, `/=`

Concatenation: `+` (arrays and strings), `+` (content)

---

## Escape Sequences

In strings and markup:

| Escape | Result |
|--------|--------|
| `\\` | Backslash |
| `\"` | Double quote (in strings) |
| `\n` | Newline |
| `\t` | Tab |
| `\u{1F600}` | Unicode code point |
| `\#` | Literal `#` in markup |
| `\*` | Literal `*` in markup |
| `\_` | Literal `_` in markup |
| `\@` | Literal `@` in markup |

---

## Common Functions Reference

### Page and Layout

```typst
#set page(
  paper: "a4",           // "a4", "us-letter", "a5", ...
  width: 210mm,          // or explicit width
  height: 297mm,         // or auto (scales to content)
  margin: 2.5cm,         // all sides; or (x: 2cm, y: 3cm)
  margin: (top: 3cm, bottom: 3cm, left: 2.5cm, right: 2.5cm),
  numbering: "1",        // page numbering format
  number-align: right,   // alignment of page number
  header: ...,           // content for header
  footer: ...,           // content for footer
  columns: 2,            // multi-column
  fill: luma(240),       // background color
)

#pagebreak()             // force page break
#pagebreak(weak: true)   // only if content doesn't cause one
#colbreak()              // break to next column
```

### Text

```typst
#set text(
  font: "New Computer Modern",  // font family
  size: 11pt,
  weight: "bold",        // "thin", "extralight", "light", "regular",
                         // "medium", "semibold", "bold", "extrabold", "black"
  style: "italic",       // "normal", "italic", "oblique"
  fill: rgb("#ff0000"),  // color
  tracking: 0.5pt,       // letter spacing
  spacing: 120%,         // word spacing
  lang: "en",            // language for hyphenation
  hyphenate: true,
  baseline: -0.5em,      // vertical offset
)

#text(size: 14pt)[Larger text]
#text(fill: blue)[Blue text]
#strong[bold]            // or *bold*
#emph[italic]            // or _italic_
#upper("hello")          // HELLO
#lower("HELLO")          // hello
#smallcaps("hello")
```

### Paragraph

```typst
#set par(
  justify: true,
  leading: 0.65em,       // line spacing
  spacing: 1.2em,        // paragraph spacing
  first-line-indent: 1em,
)

#par(hanging-indent: 1em)[Hanging indent paragraph]
```

### Block-level Elements

```typst
// Vertical space
#v(1em)
#v(1fr)   // flexible space (fills available)

// Horizontal space
#h(1em)
#h(1fr)   // flexible horizontal fill

// Box (inline container)
#box(width: 3cm, height: 1cm, fill: blue)[]

// Block (block-level container)
#block(
  width: 100%,
  inset: (x: 1em, y: 0.5em),
  fill: luma(230),
  radius: 4pt,
)[Content here]

// Align
#align(center)[Centered]
#align(right)[Right-aligned]
#align(center + horizon)[Centered vertically and horizontally]

// Pad
#pad(x: 1em, y: 0.5em)[Padded content]
```

### Grid and Table

```typst
// Grid (for layout)
#grid(
  columns: (1fr, 2fr),
  gutter: 1em,
  [Left column],
  [Right column (wider)],
)

// Table (for data)
#table(
  columns: 3,
  fill: (col, row) => if row == 0 { luma(220) } else { white },
  table.header([Name], [Score], [Grade]),
  [Alice], [95], [A],
  [Bob], [82], [B],
)

// Table cell spanning
#table.cell(colspan: 2)[Spans two columns]
#table.cell(rowspan: 2)[Spans two rows]
```

### Lists

```typst
// Customize bullets
#set list(marker: ("•", "–", "·"))

// Customize numbering
#set enum(numbering: "1.a.")

// Start enum at specific number
#enum(start: 5)[Fifth item][Sixth item]
```

### Images and Figures

```typst
// Image
#image("path/to/image.png", width: 80%)
#image("photo.jpg", height: 5cm, fit: "contain")

// Figure with caption and label
#figure(
  image("chart.png", width: 70%),
  caption: [Monthly revenue for 2024.],
  kind: "chart",
  supplement: [Figure],
) <fig:revenue>

// Reference figure
See @fig:revenue for details.
```

### Math Display Functions

```typst
// Display math block (code form)
#math.equation(block: true, numbering: "(1)")[
  E = m c^2
]

// Equation numbering
#set math.equation(numbering: "(1)")

// Reference an equation
$ x^2 + y^2 = r^2 $ <eq:circle>
As shown in @eq:circle...
```

### Counters and Introspection

```typst
// Counter
#let my-counter = counter("my-counter")
#my-counter.step()
#context my-counter.display()

// Page counter
#context counter(page).display()
#context counter(page).display("1 / 1", both: true)

// Heading counter (manual access)
#context counter(heading).display()

// Query (find elements in document)
#context {
  let figures = query(figure)
  [There are #figures.len() figures.]
}

// State (mutable across document)
#let chapter-state = state("chapter", "Introduction")
#chapter-state.update("Methods")
#context chapter-state.get()
```
