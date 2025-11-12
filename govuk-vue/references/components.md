# GOV.UK Vue Component Reference

This reference provides an overview of commonly used GOV.UK Vue components. For complete documentation including all props and detailed examples, refer to https://govukvue.org/components/.

## Installation

```bash
npm install govuk-vue
```

Import components in Vue files:
```vue
<script setup>
import { GvButton, GvTextInput, GvSelect } from 'govuk-vue'
</script>
```

## Form Components

### GvButton
Primary interactive element for user actions.

**Common Props:**
- `variant`: 'primary' | 'secondary' | 'warning' | 'inverse'
- `isStartButton`: Boolean for start button style
- `disabled`: Boolean to disable interaction

**Example:**
```vue
<GvButton variant="primary" is-start-button>
  Start now
</GvButton>

<GvButton variant="secondary">
  Save and continue
</GvButton>

<GvButton variant="warning">
  Delete account
</GvButton>
```

### GvTextInput
Single-line text input field.

**Common Props:**
- `modelValue`: v-model binding for value
- `label`: Label text
- `hint`: Help text
- `errorMessage`: Error message to display
- `type`: Input type (text, email, password, etc.)
- `width`: Input width modifier (10, 20, 30, etc.)

**Example:**
```vue
<GvTextInput
  v-model="email"
  label="Email address"
  hint="We'll only use this to contact you about your application"
  type="email"
  :width="20"
/>
```

### GvTextarea
Multi-line text input.

**Common Props:**
- `modelValue`: v-model binding
- `label`: Label text
- `hint`: Help text
- `rows`: Number of visible rows
- `maxlength`: Character limit
- `errorMessage`: Error message

**Example:**
```vue
<GvTextarea
  v-model="description"
  label="Can you provide more detail?"
  :rows="8"
  :maxlength="200"
/>
```

### GvSelect
Dropdown selection menu.

**Common Props:**
- `modelValue`: v-model binding
- `label`: Label text
- `items`: Array of options

**Example:**
```vue
<GvSelect
  v-model="country"
  label="Country"
  :items="[
    { value: 'uk', text: 'United Kingdom' },
    { value: 'us', text: 'United States' }
  ]"
/>
```

### GvRadios
Single selection from multiple options.

**Common Props:**
- `modelValue`: v-model binding
- `legend`: Fieldset legend text
- `hint`: Help text
- `items`: Array of radio options

**Example:**
```vue
<GvRadios
  v-model="contactMethod"
  legend="How would you prefer to be contacted?"
  :items="[
    { value: 'email', text: 'Email' },
    { value: 'phone', text: 'Phone' },
    { value: 'text', text: 'Text message' }
  ]"
/>
```

### GvCheckboxes
Multiple selection checkboxes.

**Common Props:**
- `modelValue`: v-model binding (array)
- `legend`: Fieldset legend text
- `hint`: Help text
- `items`: Array of checkbox options

**Example:**
```vue
<GvCheckboxes
  v-model="interests"
  legend="Select your interests"
  :items="[
    { value: 'health', text: 'Health' },
    { value: 'education', text: 'Education' },
    { value: 'transport', text: 'Transport' }
  ]"
/>
```

### GvFileUpload
File selection input.

**Common Props:**
- `modelValue`: v-model binding
- `label`: Label text
- `hint`: Help text

**Example:**
```vue
<GvFileUpload
  v-model="document"
  label="Upload a document"
  hint="Accepted formats: PDF, DOC, DOCX"
/>
```

### GvDateInput
Date input component with day, month, year fields.

**Common Props:**
- `modelValue`: v-model binding
- `legend`: Fieldset legend text
- `hint`: Help text

**Example:**
```vue
<GvDateInput
  v-model="dateOfBirth"
  legend="What is your date of birth?"
  hint="For example, 31 3 1980"
/>
```

## Navigation Components

### GvHeader
Site header with navigation and service name.

**Common Props:**
- `serviceName`: Service title
- `serviceUrl`: Service home URL
- `navigation`: Array of navigation items

**Example:**
```vue
<GvHeader
  service-name="My Service"
  service-url="/"
  :navigation="[
    { text: 'Home', href: '/' },
    { text: 'About', href: '/about' }
  ]"
/>
```

### GvBreadcrumbs
Navigational breadcrumb trail.

**Common Props:**
- `items`: Array of breadcrumb items

**Example:**
```vue
<GvBreadcrumbs
  :items="[
    { text: 'Home', href: '/' },
    { text: 'Section', href: '/section' },
    { text: 'Current page' }
  ]"
/>
```

### GvBackLink
Link to previous page.

**Example:**
```vue
<GvBackLink href="/previous-page">
  Back
</GvBackLink>
```

### GvPagination
Multi-page navigation.

**Common Props:**
- `previous`: Previous page link object
- `next`: Next page link object
- `items`: Array of page items

**Example:**
```vue
<GvPagination
  :previous="{ href: '/page-1' }"
  :next="{ href: '/page-3' }"
  :items="[
    { number: 1, href: '/page-1' },
    { number: 2, current: true },
    { number: 3, href: '/page-3' }
  ]"
/>
```

## Content Components

### GvPanel
Prominent confirmation or alert panel.

**Common Props:**
- `title`: Panel title
- `titleTag`: HTML tag for title (default h1)

**Example:**
```vue
<GvPanel title="Application complete">
  Your reference number is HDJ2123F
</GvPanel>
```

### GvNotificationBanner
Banner for important notifications.

**Common Props:**
- `title`: Banner title
- `type`: 'success' | 'info'
- `titleId`: ID for title element

**Example:**
```vue
<GvNotificationBanner
  type="success"
  title="Success"
>
  Your application has been submitted
</GvNotificationBanner>
```

### GvWarningText
Warning message with icon.

**Common Props:**
- `iconFallbackText`: Fallback text for icon

**Example:**
```vue
<GvWarningText>
  You can be fined up to £5,000 if you don't register
</GvWarningText>
```

### GvInsetText
Highlighted contextual information.

**Example:**
```vue
<GvInsetText>
  This service is for UK residents only
</GvInsetText>
```

### GvDetails
Expandable disclosure widget.

**Common Props:**
- `summaryText`: Summary/trigger text

**Example:**
```vue
<GvDetails summary-text="Help with nationality">
  We need to know your nationality so we can work out which elections you're entitled to vote in.
</GvDetails>
```

### GvAccordion
Multiple expandable sections.

**Common Props:**
- `id`: Unique accordion ID
- `items`: Array of accordion sections

**Example:**
```vue
<GvAccordion
  id="help-accordion"
  :items="[
    {
      heading: { text: 'Section 1' },
      content: { html: '<p>Content for section 1</p>' }
    },
    {
      heading: { text: 'Section 2' },
      content: { html: '<p>Content for section 2</p>' }
    }
  ]"
/>
```

### GvTabs
Tabbed content organization.

**Common Props:**
- `title`: Title for tabs
- `items`: Array of tab items

**Example:**
```vue
<GvTabs
  title="Contents"
  :items="[
    {
      label: 'Tab 1',
      id: 'tab-1',
      panel: { html: '<p>Tab 1 content</p>' }
    },
    {
      label: 'Tab 2',
      id: 'tab-2',
      panel: { html: '<p>Tab 2 content</p>' }
    }
  ]"
/>
```

## Data Display Components

### GvSummaryList
Key-value pair display (check your answers pattern).

**Common Props:**
- `rows`: Array of summary rows

**Example:**
```vue
<GvSummaryList
  :rows="[
    {
      key: { text: 'Name' },
      value: { text: 'John Smith' },
      actions: {
        items: [
          {
            href: '/edit-name',
            text: 'Change',
            visuallyHiddenText: 'name'
          }
        ]
      }
    }
  ]"
/>
```

### GvTable
Data grid display.

**Common Props:**
- `head`: Array of header cells
- `rows`: Array of data rows
- `caption`: Table caption
- `captionClasses`: CSS classes for caption

**Example:**
```vue
<GvTable
  caption="Dates and amounts"
  :head="[
    { text: 'Date' },
    { text: 'Amount' }
  ]"
  :rows="[
    [
      { text: '1 January 2024' },
      { text: '£100' }
    ]
  ]"
/>
```

### GvTag
Categorical label or status indicator.

**Common Props:**
- `colour`: Tag color (grey, blue, green, red, yellow, etc.)

**Example:**
```vue
<GvTag>Active</GvTag>
<GvTag colour="green">Completed</GvTag>
<GvTag colour="red">Cancelled</GvTag>
```

## Error Handling Components

### GvErrorMessage
Individual field error message.

**Example:**
```vue
<GvErrorMessage>
  Enter your email address
</GvErrorMessage>
```

### GvErrorSummary
Summary of errors at top of page.

**Common Props:**
- `title`: Summary title
- `errorList`: Array of errors

**Example:**
```vue
<GvErrorSummary
  title="There is a problem"
  :error-list="[
    {
      text: 'Enter your email address',
      href: '#email'
    },
    {
      text: 'Select your country',
      href: '#country'
    }
  ]"
/>
```

## Layout Components

### GvWidth-container
Centered content container with max width.

**Example:**
```vue
<GvWidth-container>
  <!-- Your content -->
</GvWidth-container>
```

### GvMain-wrapper
Main content wrapper with proper padding.

**Example:**
```vue
<GvMain-wrapper>
  <!-- Your main content -->
</GvMain-wrapper>
```

### GvGrid-row / GvGrid-column
Responsive grid system.

**Example:**
```vue
<GvGrid-row>
  <GvGrid-column desktop-size="two-thirds">
    <!-- Main content -->
  </GvGrid-column>
  <GvGrid-column desktop-size="one-third">
    <!-- Sidebar -->
  </GvGrid-column>
</GvGrid-row>
```

## Footer Components

### GvFooter
Page footer with links.

**Common Props:**
- `meta`: Meta information
- `navigation`: Navigation sections

**Example:**
```vue
<GvFooter
  :navigation="[
    {
      title: 'Services',
      items: [
        { text: 'Service 1', href: '/service-1' },
        { text: 'Service 2', href: '/service-2' }
      ]
    }
  ]"
/>
```

### GvPhaseBanner
Alpha/beta phase indicator.

**Common Props:**
- `tag`: Phase tag content

**Example:**
```vue
<GvPhaseBanner tag="Beta">
  This is a new service – your feedback will help us to improve it.
</GvPhaseBanner>
```

## Best Practices

1. **Accessibility First**: All components are built with accessibility as a priority. Always provide labels, hints, and error messages.

2. **Use Semantic HTML**: Components output semantic HTML matching GOV.UK Design System standards.

3. **Error Handling**: Always show an error summary at the top of the page when validation fails, and individual error messages next to affected fields.

4. **Progressive Enhancement**: Components work with JavaScript disabled where appropriate.

5. **Consistent Patterns**: Follow GOV.UK Design System patterns for common journeys (question pages, check answers, confirmation).

6. **Responsive Design**: All components are mobile-first and fully responsive.

For complete documentation and all available props, visit: https://govukvue.org/components/
