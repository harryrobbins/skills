---
name: govuk-react
description: Build React applications using the GOV.UK Design System with styled-components. Use this skill when building UK government services or applications that need to follow GOV.UK design patterns, when working with GOV.UK React components, or when users mention GOV.UK, government digital services, or UK public sector applications. Also applies when building accessible forms, questionnaires, or services following government accessibility standards using React and CSS-in-JS.
---

# GOV.UK React

## Overview

GOV.UK React is an implementation of the GOV.UK Design System in React using CSS-in-JS (styled-components). It provides self-contained React components that enable development of accessible, user-friendly government digital services without requiring external CSS build systems. The library follows established government service patterns and accessibility standards (WCAG 2.1 AA compliance).

**Key Features:**
- Complete set of GOV.UK Design System components as React components
- CSS-in-JS architecture using styled-components (no external CSS files needed)
- Accessibility-first design with WCAG 2.1 AA compliance
- Responsive, mobile-first layouts
- Self-contained modules that bundle styles with components
- Follows established UK government service patterns

## Installation and Setup

### Installation

Install GOV.UK React and its peer dependency:

```bash
npm install govuk-react styled-components @types/styled-components --save
```

Or with Yarn:

```bash
yarn add govuk-react styled-components @types/styled-components
```

### Basic Setup

1. **Import GlobalStyle** - Required on all pages to apply base GOV.UK styling:

```jsx
import { GlobalStyle } from 'govuk-react'

function App() {
  return (
    <>
      <GlobalStyle />
      {/* Your app content */}
    </>
  )
}
```

2. **Import components** - Import components individually for tree-shaking:

```jsx
import { Button, Input, Heading } from 'govuk-react'
```

Or import from scoped packages:

```jsx
import Button from '@govuk-react/button'
import Input from '@govuk-react/input'
```

### Required Setup Considerations

**Font Requirements:**
- The GDS Transport font is only available for official .gov.uk domains
- For non-gov.uk domains, the library falls back to system fonts

**Global Styles:**
- Include `<GlobalStyle />` component once in your app root
- Optionally use a CSS reset library (normalize.css or sanitize.css)
- Avoid conflicting global element styles that might override GOV.UK styles

## Component Categories

GOV.UK React provides 50+ components organized into categories. Refer to `references/components.md` for detailed documentation of all components with props and examples.

### Form Components (19 components)

Text inputs, selections, and interactive form elements:
- **Input** - Single-line text input
- **TextArea** - Multi-line text input
- **Select** - Dropdown selection
- **Radio** - Single choice selection
- **Checkbox** - Multiple choice selection
- **DateField** - Date entry with day/month/year inputs
- **FileUpload** - File selection
- **Button** - Interactive button (primary, secondary, warning, start)
- **InputField** - Input with label and hint text wrapper
- **FormGroup** - Form element grouping wrapper
- **Fieldset** - Grouped form elements container
- **Label** / **LabelText** - Form field labels
- **HintText** - Explanatory guidance text
- **ErrorText** - Individual error messages
- **ErrorSummary** - Consolidated error display
- **SearchBox** - Search input field
- **MultiChoice** - Multiple selection wrapper

### Navigation Components (8 components)

Page navigation and routing:
- **BackLink** - Return to previous page
- **Breadcrumbs** - Navigation trail showing hierarchy
- **Link** - Styled hyperlink with router support
- **SkipLink** - Accessibility shortcut navigation
- **TopNav** - Header navigation bar
- **Footer** - Page footer with links
- **Pagination** - Multi-page navigation
- **Tabs** - Tabbed content interface

### Layout Components (6 components)

Page structure and grid system:
- **Page** - Full page layout wrapper
- **Main** - Primary content area
- **GridRow** - Horizontal row container
- **GridCol** - Column within grid (responsive sizing)
- **SectionBreak** - Visual content divider
- **WidthContainer** (implied) - Content width constrainer

### Content Components (17 components)

Display and formatting:
- **Heading** (H1-H6) - Semantic headings
- **Paragraph** - Text paragraphs
- **LeadParagraph** - Prominent introductory text
- **Caption** - Heading captions
- **InsetText** - Highlighted callout box
- **WarningText** - Alert or caution messages
- **Panel** - Success/confirmation boxes
- **Details** - Expandable disclosure widget
- **Table** - Data tables
- **Tag** - Status or category labels
- **PhaseBanner** - Development phase indicator (alpha/beta)
- **OrderedList** - Numbered lists
- **UnorderedList** - Bulleted lists
- **ListItem** - Individual list entries
- **VisuallyHidden** - Screen-reader-only content
- **DocumentFooterMetadata** - Footer metadata display
- **RelatedItems** - Connected content links
- **LoadingBox** - Loading state indicator

## Common Workflows and Patterns

### Pattern 1: Simple Form Page

Basic form with input validation:

```jsx
import React, { useState } from 'react'
import {
  GlobalStyle,
  BackLink,
  Heading,
  Input,
  Button,
  ErrorSummary,
  FormGroup
} from 'govuk-react'

function FormPage() {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = []

    if (!email) {
      newErrors.push({
        targetName: 'email',
        text: 'Enter your email address'
      })
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    // Process form...
  }

  return (
    <>
      <GlobalStyle />
      <BackLink href="/previous">Back</BackLink>

      {errors.length > 0 && (
        <ErrorSummary
          heading="There is a problem"
          errors={errors}
        />
      )}

      <form onSubmit={handleSubmit}>
        <Heading>What is your email address?</Heading>

        <FormGroup>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            meta={{
              error: errors.find(e => e.targetName === 'email')?.text,
              touched: true
            }}
          >
            Email address
          </Input>
        </FormGroup>

        <Button type="submit">Continue</Button>
      </form>
    </>
  )
}
```

### Pattern 2: Radio Selection Form

Single choice selection pattern:

```jsx
import { Radio, Fieldset, Button } from 'govuk-react'

function RadioPage() {
  const [selected, setSelected] = useState('')

  return (
    <form onSubmit={handleSubmit}>
      <Fieldset>
        <Fieldset.Legend size="LARGE">
          Where do you live?
        </Fieldset.Legend>

        <Radio
          name="location"
          checked={selected === 'england'}
          onChange={() => setSelected('england')}
        >
          England
        </Radio>

        <Radio
          name="location"
          checked={selected === 'scotland'}
          onChange={() => setSelected('scotland')}
        >
          Scotland
        </Radio>

        <Radio
          name="location"
          checked={selected === 'wales'}
          onChange={() => setSelected('wales')}
        >
          Wales
        </Radio>

        <Radio
          name="location"
          checked={selected === 'northern-ireland'}
          onChange={() => setSelected('northern-ireland')}
        >
          Northern Ireland
        </Radio>
      </Fieldset>

      <Button type="submit">Continue</Button>
    </form>
  )
}
```

### Pattern 3: Confirmation Page

Success confirmation with reference number:

```jsx
import { Panel, Heading, Paragraph } from 'govuk-react'

function ConfirmationPage({ referenceNumber }) {
  return (
    <>
      <GlobalStyle />

      <Panel title="Application complete">
        Your reference number
        <br />
        <strong>{referenceNumber}</strong>
      </Panel>

      <Heading size="MEDIUM">What happens next</Heading>

      <Paragraph>
        We've sent your application to the relevant department.
        They will contact you within 5 working days.
      </Paragraph>

      <Paragraph>
        <Link href="/what-you-can-do-next">
          What you can do next
        </Link>
      </Paragraph>
    </>
  )
}
```

### Pattern 4: Data Table Display

Displaying tabular data:

```jsx
import { Table, Heading } from 'govuk-react'

function TablePage({ data }) {
  return (
    <>
      <Heading>Your applications</Heading>

      <Table
        head={
          <Table.Row>
            <Table.CellHeader>Reference</Table.CellHeader>
            <Table.CellHeader>Date submitted</Table.CellHeader>
            <Table.CellHeader>Status</Table.CellHeader>
            <Table.CellHeader>Actions</Table.CellHeader>
          </Table.Row>
        }
      >
        {data.map((item) => (
          <Table.Row key={item.reference}>
            <Table.Cell>{item.reference}</Table.Cell>
            <Table.Cell>{item.date}</Table.Cell>
            <Table.Cell>
              <Tag tint={item.statusColor}>{item.status}</Tag>
            </Table.Cell>
            <Table.Cell>
              <Link href={`/view/${item.reference}`}>View</Link>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table>
    </>
  )
}
```

### Pattern 5: Page Layout with Navigation

Complete page structure with header and breadcrumbs:

```jsx
import {
  GlobalStyle,
  Page,
  Breadcrumbs,
  GridRow,
  GridCol,
  Heading,
  Paragraph,
  RelatedItems,
  Link
} from 'govuk-react'

function ContentPage() {
  return (
    <>
      <GlobalStyle />

      <Page
        header={
          <Page.Header
            serviceTitle="Service Name"
            navigation={[
              <Link href="/section1">Section 1</Link>,
              <Link href="/section2">Section 2</Link>
            ]}
          />
        }
        footer={<Page.Footer />}
      >
        <Breadcrumbs>
          <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
          <Breadcrumbs.Link href="/section">Section</Breadcrumbs.Link>
          <Breadcrumbs.Link>Current page</Breadcrumbs.Link>
        </Breadcrumbs>

        <GridRow>
          <GridCol setWidth="two-thirds">
            <Heading>Page heading</Heading>
            <Paragraph>Main content goes here...</Paragraph>
          </GridCol>

          <GridCol setWidth="one-third">
            <RelatedItems>
              <Heading size="MEDIUM">Related content</Heading>
              <ul>
                <li><Link href="/related1">Related page 1</Link></li>
                <li><Link href="/related2">Related page 2</Link></li>
              </ul>
            </RelatedItems>
          </GridCol>
        </GridRow>
      </Page>
    </>
  )
}
```

## Integration with React Router

GOV.UK React Link component supports React Router integration:

```jsx
import { Link } from 'govuk-react'
import { Link as RouterLink } from 'react-router-dom'

// Use 'as' prop to integrate with React Router
<Link as={RouterLink} to="/next-page">
  Continue
</Link>

// BackLink with router
<BackLink as={RouterLink} to="/previous">
  Back
</BackLink>
```

## Styling and Theming

### Component Size Props

Many components accept size props for consistent sizing:

```jsx
// Headings
<Heading size="XLARGE">H1 equivalent</Heading>
<Heading size="LARGE">H2 equivalent</Heading>
<Heading size="MEDIUM">H3 equivalent</Heading>
<Heading size="SMALL">H4 equivalent</Heading>

// Buttons
<Button>Default size</Button>
<Button buttonSize="LARGE">Large button</Button>

// Input widths
<Input inputWidth={20}>20-character width</Input>
<Input inputWidth="full">Full width</Input>
```

### Grid Column Sizing

Responsive column widths:

```jsx
<GridRow>
  <GridCol setWidth="full">Full width</GridCol>
  <GridCol setWidth="one-half">50%</GridCol>
  <GridCol setWidth="one-third">33.33%</GridCol>
  <GridCol setWidth="two-thirds">66.66%</GridCol>
  <GridCol setWidth="one-quarter">25%</GridCol>
  <GridCol setWidth="three-quarters">75%</GridCol>
</GridRow>

// Responsive sizing
<GridCol
  setWidth="full"
  setDesktopWidth="two-thirds"
  setTabletWidth="one-half"
>
  Responsive content
</GridCol>
```

### Styled-Components Integration

Extend or customize components using styled-components:

```jsx
import styled from 'styled-components'
import { Button } from 'govuk-react'

const CustomButton = styled(Button)`
  margin-top: 20px;
  /* Additional custom styles */
`

// Use custom styled component
<CustomButton>Click me</CustomButton>
```

## Form Validation Best Practices

### Error Summary

Always display error summary at top of page when validation fails:

```jsx
const [errors, setErrors] = useState([])

// Build errors array
const newErrors = []
if (!email) {
  newErrors.push({
    targetName: 'email',
    text: 'Enter your email address'
  })
}

// Display error summary
{errors.length > 0 && (
  <ErrorSummary
    heading="There is a problem"
    description="Check the following:"
    errors={errors}
  />
)}
```

### Field-Level Errors

Connect errors to individual fields:

```jsx
<Input
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  meta={{
    error: errors.find(e => e.targetName === 'email')?.text,
    touched: true
  }}
>
  Email address
</Input>
```

### Error Message Guidelines

Follow GOV.UK error message patterns:
- Be specific about the problem
- Tell users how to fix it
- Use simple language
- Don't blame the user
- Examples:
  - Good: "Enter your email address"
  - Bad: "Email is required"
  - Good: "Enter a date in the format DD/MM/YYYY"
  - Bad: "Invalid date format"

## Accessibility Considerations

### Required Practices

1. **Always include labels** - Every input needs a label for screen readers
2. **Provide hint text** - Help users understand what's needed
3. **Use semantic HTML** - Components output proper semantic HTML
4. **Maintain heading hierarchy** - Use Heading components in order (XLARGE → LARGE → MEDIUM)
5. **Handle focus management** - Focus error summary on validation failure
6. **Test with keyboard** - Ensure all interactions work without mouse
7. **Support screen readers** - Use VisuallyHidden for additional context

### ARIA Attributes

Components handle ARIA attributes automatically, but can be extended:

```jsx
<Button aria-describedby="button-help">
  Submit application
</Button>
<HintText id="button-help">
  This will submit your application for review
</HintText>
```

## Component Props Reference

For detailed documentation of all 50+ components including:
- Complete prop lists
- Type definitions
- Code examples
- Usage patterns
- Accessibility notes

Refer to: `references/components.md`

This reference file is organized by component category and provides comprehensive documentation for each component.

## Example Scripts

The `scripts/` directory contains example implementations:

### scripts/form-example.jsx
Complete form implementation with validation, error handling, and submission. Demonstrates best practices for building accessible forms with GOV.UK React.

### scripts/page-layout-example.jsx
Full page layout example showing proper structure with header, breadcrumbs, grid system, and footer. Useful as a starting template for new pages.

### scripts/multi-step-form.jsx
Multi-step form journey example with navigation between steps, data persistence, and check-your-answers pattern. Shows how to build complex service journeys.

## Resources and Documentation

### Official Resources
- **Storybook Documentation**: https://govuk-react.github.io/govuk-react/
- **GitHub Repository**: https://github.com/govuk-react/govuk-react
- **NPM Package**: https://www.npmjs.com/package/govuk-react

### GOV.UK Design System
- **Design System**: https://design-system.service.gov.uk/
- **Design Patterns**: https://design-system.service.gov.uk/patterns/
- **Content Guidelines**: https://www.gov.uk/guidance/content-design

### Styled-Components
- **Documentation**: https://styled-components.com/docs
- **API Reference**: https://styled-components.com/docs/api

## Common Tasks

### Creating a New Form

1. Import required components (GlobalStyle, form components, Button)
2. Set up state management for form data
3. Create validation logic
4. Build error handling structure
5. Implement form layout with proper fieldsets
6. Add error summary and field errors
7. Handle form submission
8. Test with keyboard and screen readers

### Building a Multi-Page Service

1. Set up routing (React Router recommended)
2. Create page components following "one thing per page" pattern
3. Implement state management for journey data (Context API or Redux)
4. Add navigation between pages (BackLink, Button)
5. Create "check your answers" summary page
6. Build confirmation page
7. Allow users to change answers and return
8. Test complete journey flow

### Implementing Accessible Tables

1. Use Table component with proper head structure
2. Include Table.CellHeader for column headers
3. Provide row headers where appropriate
4. Use caption for table description
5. Keep tables simple and focused
6. Consider responsive behavior for mobile
7. Test with screen readers

### Styling Custom Components

1. Import component from govuk-react
2. Use styled-components to extend
3. Maintain GOV.UK Design System spacing and colors
4. Test that custom styles don't break accessibility
5. Verify responsive behavior
6. Check color contrast ratios

## Troubleshooting

### Common Issues

**GlobalStyle not applied:**
- Ensure `<GlobalStyle />` is included in app root
- Check for conflicting CSS resets
- Verify styled-components is properly installed

**Fonts not displaying correctly:**
- GDS Transport font only works on .gov.uk domains
- Library falls back to system fonts on other domains
- This is expected behavior

**Components not rendering:**
- Verify styled-components peer dependency is installed
- Check for version mismatches between govuk-react and styled-components
- Ensure proper import syntax

**TypeScript errors:**
- Install @types/styled-components
- Check that component props match expected types
- Refer to TypeScript definitions in node_modules/@types

**Router integration not working:**
- Use 'as' prop to pass router Link component
- Verify React Router is properly configured
- Check that 'to' prop is used instead of 'href' with router

## Best Practices Summary

### Content Design
- Use clear, simple language
- Front-load important information
- Follow "one thing per page" for forms
- Use active voice and short sentences
- Make optional fields explicit

### Form Design
- Only ask for necessary information
- Provide helpful hint text
- Use appropriate input types
- Group related fields with Fieldset
- Implement comprehensive validation

### Navigation
- Always provide BackLink except on entry pages
- Show clear progress indicators
- Allow users to check and change answers
- Provide clear confirmation after submission

### Error Handling
- Display ErrorSummary at top of page
- Link errors to specific fields
- Use clear, specific error messages
- Tell users how to fix errors
- Preserve user data on validation errors

### Accessibility
- Maintain logical heading hierarchy
- Provide labels and hints for all inputs
- Support keyboard navigation
- Test with screen readers
- Ensure sufficient color contrast
- Use semantic HTML through components
