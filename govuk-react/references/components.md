# GOV.UK React Components Reference

Comprehensive reference documentation for all GOV.UK React components, organized by category.

## Table of Contents

1. [Form Components](#form-components)
2. [Navigation Components](#navigation-components)
3. [Layout Components](#layout-components)
4. [Content Components](#content-components)
5. [Common Props and Patterns](#common-props-and-patterns)

---

## Form Components

### Button

Interactive button element with multiple variants.

**Import:**
```jsx
import { Button } from 'govuk-react'
// or
import Button from '@govuk-react/button'
```

**Props:**
- `type` - HTML button type ('button', 'submit', 'reset')
- `variant` - Visual style ('default', 'primary', 'secondary', 'warning')
- `disabled` - Disables the button
- `buttonSize` - Size variant ('LARGE', 'MEDIUM', 'SMALL')
- `isStartButton` - Displays with start button arrow
- `onClick` - Click handler function

**Example:**
```jsx
<Button type="submit" variant="primary">
  Continue
</Button>

<Button variant="secondary" onClick={handleClick}>
  Cancel
</Button>

<Button variant="warning">
  Delete account
</Button>

<Button isStartButton>
  Start now
</Button>
```

---

### Input

Single-line text input field.

**Import:**
```jsx
import { Input } from 'govuk-react'
```

**Props:**
- `value` - Input value (controlled component)
- `onChange` - Change handler
- `type` - Input type ('text', 'email', 'tel', 'number', 'password', etc.)
- `inputWidth` - Width in characters or 'full'
- `hint` - Help text below label
- `error` - Error message (displays error styling)
- `meta` - Object with `error` and `touched` for validation
- `disabled` - Disables the input
- `placeholder` - Placeholder text
- `autoComplete` - HTML autocomplete attribute

**Example:**
```jsx
<Input
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  type="email"
  inputWidth={30}
  meta={{
    error: errors.email,
    touched: true
  }}
>
  Email address
</Input>

<Input
  value={name}
  onChange={(e) => setName(e.target.value)}
  hint="Enter your full name as it appears on official documents"
>
  Full name
</Input>
```

---

### TextArea

Multi-line text input field.

**Import:**
```jsx
import { TextArea } from 'govuk-react'
```

**Props:**
- `value` - Textarea value
- `onChange` - Change handler
- `rows` - Number of visible rows
- `hint` - Help text
- `error` - Error message
- `meta` - Validation object
- `disabled` - Disables the textarea
- `maxLength` - Maximum character count

**Example:**
```jsx
<TextArea
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  rows={5}
  hint="Provide as much detail as possible"
  meta={{
    error: errors.description,
    touched: true
  }}
>
  Description
</TextArea>
```

---

### Select

Dropdown selection menu.

**Import:**
```jsx
import { Select } from 'govuk-react'
```

**Props:**
- `value` - Selected value
- `onChange` - Change handler
- `input` - Input props object
- `meta` - Validation object
- `hint` - Help text
- `children` - `<option>` elements

**Example:**
```jsx
<Select
  value={country}
  onChange={(e) => setCountry(e.target.value)}
  label="Select your country"
  hint="This is where your order will be shipped"
>
  <option value="">Please select</option>
  <option value="uk">United Kingdom</option>
  <option value="fr">France</option>
  <option value="de">Germany</option>
</Select>
```

---

### Radio

Single choice radio button (use multiple for radio groups).

**Import:**
```jsx
import { Radio } from 'govuk-react'
```

**Props:**
- `name` - Radio group name (same for all related radios)
- `value` - Radio value
- `checked` - Whether radio is selected
- `onChange` - Change handler
- `hint` - Help text for this option
- `disabled` - Disables the radio
- `children` - Label text

**Example:**
```jsx
<Fieldset>
  <Fieldset.Legend>Where do you live?</Fieldset.Legend>

  <Radio
    name="location"
    value="england"
    checked={location === 'england'}
    onChange={(e) => setLocation(e.target.value)}
  >
    England
  </Radio>

  <Radio
    name="location"
    value="scotland"
    checked={location === 'scotland'}
    onChange={(e) => setLocation(e.target.value)}
  >
    Scotland
  </Radio>

  <Radio
    name="location"
    value="wales"
    checked={location === 'wales'}
    onChange={(e) => setLocation(e.target.value)}
    hint="Including Cardiff and surrounding areas"
  >
    Wales
  </Radio>
</Fieldset>
```

---

### Checkbox

Multiple choice checkbox (can use individually or in groups).

**Import:**
```jsx
import { Checkbox } from 'govuk-react'
```

**Props:**
- `value` - Checkbox value
- `checked` - Whether checkbox is selected
- `onChange` - Change handler
- `hint` - Help text for this option
- `disabled` - Disables the checkbox
- `children` - Label text

**Example:**
```jsx
<Fieldset>
  <Fieldset.Legend>Select your interests</Fieldset.Legend>

  <Checkbox
    checked={interests.includes('technology')}
    onChange={(e) => {
      if (e.target.checked) {
        setInterests([...interests, 'technology'])
      } else {
        setInterests(interests.filter(i => i !== 'technology'))
      }
    }}
  >
    Technology
  </Checkbox>

  <Checkbox
    checked={interests.includes('sports')}
    onChange={(e) => handleCheckboxChange('sports', e.target.checked)}
  >
    Sports
  </Checkbox>

  <Checkbox
    checked={interests.includes('arts')}
    onChange={(e) => handleCheckboxChange('arts', e.target.checked)}
    hint="Including music, theater, and visual arts"
  >
    Arts and Culture
  </Checkbox>
</Fieldset>
```

---

### DateField

Date input with separate fields for day, month, and year.

**Import:**
```jsx
import { DateField } from 'govuk-react'
// or
import DateField from '@govuk-react/date-field'
```

**Props:**
- `input` - Input props object
- `meta` - Validation object
- `hint` - Help text
- `errorText` - Error message
- `children` - Legend text

**Example:**
```jsx
<DateField
  input={{
    value: dateOfBirth,
    onChange: (e) => setDateOfBirth(e.target.value)
  }}
  meta={{
    error: errors.dateOfBirth,
    touched: true
  }}
  hint="For example, 31 3 1980"
>
  What is your date of birth?
</DateField>
```

---

### FileUpload

File selection input.

**Import:**
```jsx
import { FileUpload } from 'govuk-react'
```

**Props:**
- `onChange` - Change handler
- `hint` - Help text
- `error` - Error message
- `meta` - Validation object
- `accept` - Accepted file types
- `children` - Label text

**Example:**
```jsx
<FileUpload
  onChange={(e) => setFile(e.target.files[0])}
  hint="Upload a CSV file smaller than 10MB"
  accept=".csv"
  meta={{
    error: errors.file,
    touched: true
  }}
>
  Upload a file
</FileUpload>
```

---

### Fieldset

Container for grouping related form elements with a legend.

**Import:**
```jsx
import { Fieldset } from 'govuk-react'
```

**Props:**
- `children` - Form elements
- Uses `Fieldset.Legend` sub-component for the legend

**Fieldset.Legend Props:**
- `size` - Legend size ('XLARGE', 'LARGE', 'MEDIUM', 'SMALL')
- `children` - Legend text

**Example:**
```jsx
<Fieldset>
  <Fieldset.Legend size="LARGE">
    What is your address?
  </Fieldset.Legend>

  <Input>Address line 1</Input>
  <Input>Address line 2</Input>
  <Input>City</Input>
  <Input>Postcode</Input>
</Fieldset>
```

---

### FormGroup

Wrapper for form elements that adds consistent spacing.

**Import:**
```jsx
import { FormGroup } from 'govuk-react'
```

**Props:**
- `children` - Form elements
- `error` - Whether group has error state

**Example:**
```jsx
<form onSubmit={handleSubmit}>
  <FormGroup>
    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)}>
      First name
    </Input>
  </FormGroup>

  <FormGroup>
    <Input value={lastName} onChange={(e) => setLastName(e.target.value)}>
      Last name
    </Input>
  </FormGroup>

  <Button type="submit">Continue</Button>
</form>
```

---

### Label / LabelText

Form field labels.

**Import:**
```jsx
import { Label, LabelText } from 'govuk-react'
```

**Props:**
- `htmlFor` - ID of associated input
- `children` - Label text
- `size` - Label size

**Example:**
```jsx
<Label htmlFor="email">Email address</Label>
<input id="email" type="email" />

<LabelText>Helper label text</LabelText>
```

---

### HintText

Explanatory guidance text for form fields.

**Import:**
```jsx
import { HintText } from 'govuk-react'
```

**Props:**
- `children` - Hint text content

**Example:**
```jsx
<Label htmlFor="ni-number">National Insurance number</Label>
<HintText>
  It's on your National Insurance card, benefit letter, payslip or P60.
  For example, 'QQ 12 34 56 C'.
</HintText>
<input id="ni-number" type="text" />
```

---

### ErrorText

Individual error message for form fields.

**Import:**
```jsx
import { ErrorText } from 'govuk-react'
```

**Props:**
- `children` - Error message text

**Example:**
```jsx
{errors.email && (
  <ErrorText>Enter a valid email address</ErrorText>
)}
<Input
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
>
  Email address
</Input>
```

---

### ErrorSummary

Consolidated error display at top of page.

**Import:**
```jsx
import { ErrorSummary } from 'govuk-react'
```

**Props:**
- `heading` - Summary heading (e.g., "There is a problem")
- `description` - Optional description text
- `errors` - Array of error objects with `targetName` and `text`
- `onHandleErrorClick` - Custom click handler for error links

**Example:**
```jsx
{errors.length > 0 && (
  <ErrorSummary
    heading="There is a problem"
    description="Check the following:"
    errors={errors}
  />
)}

// errors array format:
const errors = [
  { targetName: 'email', text: 'Enter your email address' },
  { targetName: 'password', text: 'Password must be at least 8 characters' }
]
```

---

### SearchBox

Search input field with submit button.

**Import:**
```jsx
import { SearchBox } from 'govuk-react'
```

**Props:**
- `onSubmit` - Form submit handler
- `placeholder` - Placeholder text
- `value` - Search value
- `onChange` - Change handler

**Example:**
```jsx
<SearchBox
  placeholder="Search for services"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  onSubmit={(e) => {
    e.preventDefault()
    performSearch(searchQuery)
  }}
/>
```

---

## Navigation Components

### BackLink

Link to return to previous page.

**Import:**
```jsx
import { BackLink } from 'govuk-react'
```

**Props:**
- `href` - Link destination
- `onClick` - Click handler (for custom navigation)
- `as` - Router component (e.g., React Router Link)
- `to` - Destination when using router

**Example:**
```jsx
<BackLink href="/previous-page">Back</BackLink>

// With React Router
import { Link as RouterLink } from 'react-router-dom'

<BackLink as={RouterLink} to="/previous">
  Back
</BackLink>
```

---

### Breadcrumbs

Navigation trail showing page hierarchy.

**Import:**
```jsx
import { Breadcrumbs } from 'govuk-react'
```

**Props:**
- `children` - Breadcrumb link items (use `Breadcrumbs.Link`)

**Breadcrumbs.Link Props:**
- `href` - Link destination
- `children` - Link text

**Example:**
```jsx
<Breadcrumbs>
  <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
  <Breadcrumbs.Link href="/section">Section</Breadcrumbs.Link>
  <Breadcrumbs.Link href="/section/subsection">Subsection</Breadcrumbs.Link>
  <Breadcrumbs.Link>Current page</Breadcrumbs.Link>
</Breadcrumbs>
```

---

### Link

Styled hyperlink with router support.

**Import:**
```jsx
import { Link } from 'govuk-react'
```

**Props:**
- `href` - Link destination
- `target` - Link target (_blank, _self, etc.)
- `rel` - Link relationship
- `as` - Router component
- `to` - Destination when using router
- `noVisitedState` - Removes visited link styling
- `muted` - Displays muted styling
- `textColour` - Custom text color

**Example:**
```jsx
<Link href="/next-page">Continue to next page</Link>

<Link href="https://gov.uk" target="_blank" rel="noopener noreferrer">
  GOV.UK homepage (opens in new tab)
</Link>

// With React Router
<Link as={RouterLink} to="/dashboard">
  Go to dashboard
</Link>

<Link href="/help" muted>Secondary link</Link>
```

---

### SkipLink

Accessibility shortcut to skip to main content.

**Import:**
```jsx
import { SkipLink } from 'govuk-react'
```

**Props:**
- `href` - Target element ID (e.g., '#main-content')
- `children` - Link text

**Example:**
```jsx
<SkipLink href="#main-content">
  Skip to main content
</SkipLink>

<main id="main-content">
  {/* Page content */}
</main>
```

---

### TopNav

Header navigation bar.

**Import:**
```jsx
import { TopNav } from 'govuk-react'
```

**Props:**
- `serviceTitle` - Service name displayed in header
- `search` - Search component
- `children` - Navigation items

**Example:**
```jsx
<TopNav serviceTitle="Apply for a licence">
  <TopNav.Item href="/dashboard">Dashboard</TopNav.Item>
  <TopNav.Item href="/applications">Applications</TopNav.Item>
  <TopNav.Item href="/profile">Profile</TopNav.Item>
</TopNav>
```

---

### Footer

Page footer with links.

**Import:**
```jsx
import { Footer } from 'govuk-react'
```

**Props:**
- `meta` - Meta links section
- `navigation` - Array of navigation link objects
- `children` - Footer content

**Example:**
```jsx
<Footer
  meta={
    <Footer.MetaLinks>
      <Footer.MetaLink href="/help">Help</Footer.MetaLink>
      <Footer.MetaLink href="/cookies">Cookies</Footer.MetaLink>
      <Footer.MetaLink href="/contact">Contact</Footer.MetaLink>
      <Footer.MetaLink href="/terms">Terms and conditions</Footer.MetaLink>
    </Footer.MetaLinks>
  }
>
  <Footer.Navigation>
    <Footer.NavigationLinks heading="Services">
      <Footer.Link href="/service1">Service 1</Footer.Link>
      <Footer.Link href="/service2">Service 2</Footer.Link>
    </Footer.NavigationLinks>
  </Footer.Navigation>
</Footer>
```

---

### Pagination

Multi-page navigation controls.

**Import:**
```jsx
import { Pagination } from 'govuk-react'
```

**Props:**
- `currentPage` - Current page number
- `totalPages` - Total number of pages
- `onPageChange` - Page change handler
- `pageHref` - Function to generate page URLs

**Example:**
```jsx
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={(page) => setCurrentPage(page)}
/>
```

---

### Tabs

Tabbed content interface.

**Import:**
```jsx
import { Tabs } from 'govuk-react'
```

**Props:**
- `title` - Tabs section title
- `children` - Tab items (use `Tabs.Panel`)

**Example:**
```jsx
<Tabs title="Application details">
  <Tabs.Panel label="Personal details">
    {/* Personal details content */}
  </Tabs.Panel>
  <Tabs.Panel label="Contact information">
    {/* Contact info content */}
  </Tabs.Panel>
  <Tabs.Panel label="Documents">
    {/* Documents content */}
  </Tabs.Panel>
</Tabs>
```

---

## Layout Components

### Page

Full page layout wrapper with header and footer.

**Import:**
```jsx
import { Page } from 'govuk-react'
```

**Props:**
- `header` - Header component
- `footer` - Footer component
- `beforeContent` - Content before main area (e.g., breadcrumbs)
- `children` - Main page content

**Example:**
```jsx
<Page
  header={<Page.Header serviceTitle="Service name" />}
  footer={<Page.Footer />}
  beforeContent={<Breadcrumbs>...</Breadcrumbs>}
>
  {/* Page content */}
</Page>
```

---

### Main

Primary content area wrapper.

**Import:**
```jsx
import { Main } from 'govuk-react'
```

**Props:**
- `children` - Main content
- `className` - Additional CSS classes

**Example:**
```jsx
<Main>
  <Heading>Page title</Heading>
  <Paragraph>Main content goes here</Paragraph>
</Main>
```

---

### GridRow

Horizontal row container for grid layout.

**Import:**
```jsx
import { GridRow } from 'govuk-react'
```

**Props:**
- `children` - GridCol components

**Example:**
```jsx
<GridRow>
  <GridCol setWidth="two-thirds">
    {/* Main content */}
  </GridCol>
  <GridCol setWidth="one-third">
    {/* Sidebar */}
  </GridCol>
</GridRow>
```

---

### GridCol

Column within grid row.

**Import:**
```jsx
import { GridCol } from 'govuk-react'
```

**Props:**
- `setWidth` - Column width ('full', 'one-half', 'one-third', 'two-thirds', 'one-quarter', 'three-quarters')
- `setDesktopWidth` - Desktop-specific width
- `setTabletWidth` - Tablet-specific width
- `children` - Column content

**Example:**
```jsx
<GridRow>
  <GridCol setWidth="two-thirds">
    <Heading>Main content</Heading>
  </GridCol>
  <GridCol setWidth="one-third">
    <RelatedItems>...</RelatedItems>
  </GridCol>
</GridRow>

// Responsive columns
<GridRow>
  <GridCol
    setWidth="full"
    setTabletWidth="one-half"
    setDesktopWidth="one-third"
  >
    Responsive column
  </GridCol>
</GridRow>
```

---

### SectionBreak

Visual content divider.

**Import:**
```jsx
import { SectionBreak } from 'govuk-react'
```

**Props:**
- `level` - Visual weight ('LARGE', 'MEDIUM', 'SMALL')
- `visible` - Whether line is visible

**Example:**
```jsx
<Paragraph>First section content</Paragraph>
<SectionBreak level="LARGE" visible />
<Paragraph>Second section content</Paragraph>
```

---

## Content Components

### Heading

Semantic heading elements (H1-H6).

**Import:**
```jsx
import { Heading } from 'govuk-react'
```

**Props:**
- `size` - Visual size ('XLARGE', 'LARGE', 'MEDIUM', 'SMALL')
- `level` - Semantic level (1-6, defaults based on size)
- `children` - Heading text

**Size-to-level mapping:**
- XLARGE → H1
- LARGE → H2
- MEDIUM → H3
- SMALL → H4

**Example:**
```jsx
<Heading size="XLARGE">Page title (H1)</Heading>
<Heading size="LARGE">Section heading (H2)</Heading>
<Heading size="MEDIUM">Subsection (H3)</Heading>
<Heading size="SMALL">Minor heading (H4)</Heading>

// Custom semantic level
<Heading size="LARGE" level={3}>
  Visually H2-sized but semantically H3
</Heading>
```

---

### Paragraph

Text paragraph block.

**Import:**
```jsx
import { Paragraph } from 'govuk-react'
```

**Props:**
- `children` - Paragraph text
- `supportingText` - Displays with secondary text styling

**Example:**
```jsx
<Paragraph>
  This is a standard paragraph with regular text.
</Paragraph>

<Paragraph supportingText>
  This is supporting text with a lighter appearance.
</Paragraph>
```

---

### LeadParagraph

Prominent introductory text (larger than regular paragraphs).

**Import:**
```jsx
import { LeadParagraph } from 'govuk-react'
```

**Props:**
- `children` - Lead paragraph text

**Example:**
```jsx
<Heading>Service name</Heading>
<LeadParagraph>
  Use this service to apply for a new licence or renew an existing one.
</LeadParagraph>
<Paragraph>
  Regular paragraph text follows...
</Paragraph>
```

---

### Caption

Text caption for headings (displays above heading).

**Import:**
```jsx
import { Caption } from 'govuk-react'
```

**Props:**
- `size` - Caption size matching heading size
- `children` - Caption text

**Example:**
```jsx
<Caption size="XLARGE">Step 2 of 4</Caption>
<Heading size="XLARGE">Contact details</Heading>
```

---

### InsetText

Highlighted callout box for important information.

**Import:**
```jsx
import { InsetText } from 'govuk-react'
```

**Props:**
- `children` - Inset content

**Example:**
```jsx
<InsetText>
  It can take up to 8 weeks to register a lasting power of attorney
  if there are no mistakes in the application.
</InsetText>
```

---

### WarningText

Alert or caution message with warning icon.

**Import:**
```jsx
import { WarningText } from 'govuk-react'
```

**Props:**
- `children` - Warning text
- `iconFallbackText` - Alternative text for icon (default: "Warning")

**Example:**
```jsx
<WarningText>
  You can be fined up to £5,000 if you do not register.
</WarningText>
```

---

### Panel

Success or confirmation panel (typically used after submission).

**Import:**
```jsx
import { Panel } from 'govuk-react'
```

**Props:**
- `title` - Panel title
- `children` - Panel content (e.g., reference number)

**Example:**
```jsx
<Panel title="Application complete">
  Your reference number
  <br />
  <strong>HDJ2123F</strong>
</Panel>
```

---

### Details

Expandable disclosure widget (accordion-style).

**Import:**
```jsx
import { Details } from 'govuk-react'
```

**Props:**
- `summary` - Summary text (always visible)
- `children` - Hidden content (revealed on click)
- `open` - Whether details are expanded by default

**Example:**
```jsx
<Details summary="Help with this question">
  <Paragraph>
    You should provide information about all previous addresses
    where you have lived in the last 5 years.
  </Paragraph>
</Details>
```

---

### Table

Data table display.

**Import:**
```jsx
import { Table } from 'govuk-react'
```

**Props:**
- `head` - Table header row (use `Table.Row` with `Table.CellHeader`)
- `caption` - Table caption
- `children` - Table body rows (use `Table.Row` with `Table.Cell`)

**Example:**
```jsx
<Table
  caption="Applications submitted"
  head={
    <Table.Row>
      <Table.CellHeader>Date</Table.CellHeader>
      <Table.CellHeader>Reference</Table.CellHeader>
      <Table.CellHeader numeric>Amount</Table.CellHeader>
      <Table.CellHeader>Status</Table.CellHeader>
    </Table.Row>
  }
>
  <Table.Row>
    <Table.Cell>12 Jan 2024</Table.Cell>
    <Table.Cell>HDJ-2024-0123</Table.Cell>
    <Table.Cell numeric>£120.00</Table.Cell>
    <Table.Cell><Tag tint="GREEN">Approved</Tag></Table.Cell>
  </Table.Row>
  <Table.Row>
    <Table.Cell>15 Jan 2024</Table.Cell>
    <Table.Cell>HDJ-2024-0124</Table.Cell>
    <Table.Cell numeric>£85.50</Table.Cell>
    <Table.Cell><Tag tint="BLUE">Processing</Tag></Table.Cell>
  </Table.Row>
</Table>
```

---

### Tag

Status or category label.

**Import:**
```jsx
import { Tag } from 'govuk-react'
```

**Props:**
- `tint` - Color variant ('GREY', 'GREEN', 'TURQUOISE', 'BLUE', 'PURPLE', 'PINK', 'RED', 'ORANGE', 'YELLOW')
- `inactive` - Displays inactive styling
- `children` - Tag text

**Example:**
```jsx
<Tag tint="GREEN">Completed</Tag>
<Tag tint="BLUE">In progress</Tag>
<Tag tint="YELLOW">Pending</Tag>
<Tag tint="RED">Rejected</Tag>
<Tag tint="GREY" inactive>Draft</Tag>
```

---

### PhaseBanner

Development phase indicator (alpha, beta, etc.).

**Import:**
```jsx
import { PhaseBanner } from 'govuk-react'
```

**Props:**
- `level` - Phase level ('alpha', 'beta')
- `children` - Banner message

**Example:**
```jsx
<PhaseBanner level="beta">
  This is a new service – your{' '}
  <Link href="/feedback">feedback</Link> will help us to improve it.
</PhaseBanner>
```

---

### OrderedList / UnorderedList

Numbered or bulleted lists.

**Import:**
```jsx
import { OrderedList, UnorderedList } from 'govuk-react'
```

**Props:**
- `children` - ListItem components

**Example:**
```jsx
<OrderedList>
  <ListItem>First step</ListItem>
  <ListItem>Second step</ListItem>
  <ListItem>Third step</ListItem>
</OrderedList>

<UnorderedList>
  <ListItem>Passport</ListItem>
  <ListItem>Driving licence</ListItem>
  <ListItem>National Insurance card</ListItem>
</UnorderedList>
```

---

### ListItem

Individual list entry.

**Import:**
```jsx
import { ListItem } from 'govuk-react'
```

**Props:**
- `children` - List item content

**Example:**
```jsx
<UnorderedList>
  <ListItem>Item 1</ListItem>
  <ListItem>
    Item 2 with <Link href="/link">a link</Link>
  </ListItem>
</UnorderedList>
```

---

### VisuallyHidden

Screen-reader-only content (hidden visually).

**Import:**
```jsx
import { VisuallyHidden } from 'govuk-react'
```

**Props:**
- `children` - Hidden content
- `important` - Adds !important to CSS rules

**Example:**
```jsx
<Link href="/edit">
  Edit
  <VisuallyHidden> contact details</VisuallyHidden>
</Link>

// Screen readers hear: "Edit contact details"
// Visual users see: "Edit"
```

---

### DocumentFooterMetadata

Footer metadata display for documents.

**Import:**
```jsx
import { DocumentFooterMetadata } from 'govuk-react'
```

**Props:**
- `from` - Array of "from" metadata items
- `other` - Object with additional metadata

**Example:**
```jsx
<DocumentFooterMetadata
  from={[
    { title: 'Department for Education' },
    { title: 'Department of Health' }
  ]}
  other={{
    'Published': '12 January 2024',
    'Last updated': '15 January 2024'
  }}
/>
```

---

### RelatedItems

Connected content links sidebar.

**Import:**
```jsx
import { RelatedItems } from 'govuk-react'
```

**Props:**
- `children` - Related content

**Example:**
```jsx
<RelatedItems>
  <Heading size="MEDIUM">Related content</Heading>
  <UnorderedList>
    <ListItem><Link href="/guide1">Related guide 1</Link></ListItem>
    <ListItem><Link href="/guide2">Related guide 2</Link></ListItem>
    <ListItem><Link href="/guide3">Related guide 3</Link></ListItem>
  </UnorderedList>
</RelatedItems>
```

---

### LoadingBox

Loading state indicator.

**Import:**
```jsx
import { LoadingBox } from 'govuk-react'
```

**Props:**
- `loading` - Whether to show loading state
- `children` - Content to display when not loading
- `title` - Loading message
- `backgroundColor` - Custom background color
- `timeIn` - Fade in duration (ms)
- `timeOut` - Fade out duration (ms)

**Example:**
```jsx
<LoadingBox loading={isLoading} title="Loading your data...">
  {/* Content appears when loading completes */}
  <Paragraph>Your data has loaded.</Paragraph>
</LoadingBox>
```

---

## Common Props and Patterns

### Meta Object for Form Validation

Many form components accept a `meta` prop for validation state:

```jsx
const meta = {
  error: 'Error message string or null',
  touched: true  // Whether field has been interacted with
}

<Input
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  meta={meta}
>
  Email address
</Input>
```

### Router Integration Pattern

Components with `href` prop support router integration via `as` prop:

```jsx
import { Link as RouterLink } from 'react-router-dom'

<Link as={RouterLink} to="/destination">
  Link text
</Link>

<BackLink as={RouterLink} to="/previous">
  Back
</BackLink>

<Button as={RouterLink} to="/next">
  Continue
</Button>
```

### Consistent Sizing

Size props across components use consistent values:

- **Headings:** XLARGE, LARGE, MEDIUM, SMALL
- **Buttons:** LARGE, MEDIUM, SMALL
- **Grid columns:** full, one-half, one-third, two-thirds, one-quarter, three-quarters
- **Input widths:** Numbers (character count) or 'full'

### Error Handling Pattern

Standard pattern for form validation:

```jsx
const [errors, setErrors] = useState([])

// Validation
const newErrors = []
if (!field) {
  newErrors.push({
    targetName: 'field-id',
    text: 'Error message'
  })
}
setErrors(newErrors)

// Display error summary
{errors.length > 0 && (
  <ErrorSummary heading="There is a problem" errors={errors} />
)}

// Display field error
<Input
  value={field}
  onChange={(e) => setField(e.target.value)}
  meta={{
    error: errors.find(e => e.targetName === 'field-id')?.text,
    touched: true
  }}
>
  Field label
</Input>
```

### Accessibility Best Practices

1. **Always pair inputs with labels** - Use component children for labels
2. **Provide hint text** - Help users understand requirements
3. **Use semantic heading hierarchy** - XLARGE (H1) → LARGE (H2) → MEDIUM (H3)
4. **Include VisuallyHidden context** - Add hidden text for screen readers
5. **Handle focus management** - Focus error summary on validation
6. **Test keyboard navigation** - Ensure all interactions work without mouse

---

## Additional Resources

For live component examples and interactive demos:
- **Storybook**: https://govuk-react.github.io/govuk-react/

For GOV.UK Design System patterns:
- **Design System**: https://design-system.service.gov.uk/
- **Patterns**: https://design-system.service.gov.uk/patterns/

For styled-components documentation:
- **Docs**: https://styled-components.com/docs
