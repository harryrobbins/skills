---
name: govuk-vue
description: Build Vue 3 applications using the GOV.UK Design System. This skill should be used when building government services or applications that need to follow GOV.UK design patterns, when working with GOV.UK Vue components, or when users mention GOV.UK, government digital services, or UK public sector applications. Also applies when users want to create forms, questionnaires, or multi-step processes following accessibility-first government standards.
---

# GOV.UK Vue

## Overview

GOV.UK Vue is a Vue 3 component library that implements the GOV.UK Design System, enabling development of accessible, user-friendly government digital services. The library provides Vue components that output the same HTML as GOV.UK Frontend's Nunjucks templates, with all JavaScript functionality reimplemented in TypeScript.

**Key Features:**
- Full implementation of GOV.UK Frontend components as Vue 3 components
- Accessibility-first design with WCAG 2.1 AA compliance
- Responsive, mobile-first layouts
- No external dependencies beyond Vue
- Follows established government service patterns

## Installation and Setup

### Quick Start with Starter Template

For new projects, use the pre-configured starter template in `assets/starter-template/`:

1. Copy the entire `starter-template` directory to desired location
2. Install dependencies:
```bash
npm install
```
3. Start development server:
```bash
npm run dev
```

The starter template includes:
- Vite build configuration
- Vue Router setup
- GOV.UK Vue integration
- Example pages demonstrating common patterns
- Proper HTML structure with GOV.UK Frontend CSS

### Manual Installation

For existing projects:

1. Install GOV.UK Vue:
```bash
npm install govuk-vue
```

2. Include GOV.UK Frontend CSS in `index.html`:
```html
<link rel="stylesheet" href="https://unpkg.com/govuk-frontend@5.10.2/dist/govuk/govuk-frontend.min.css">
```

3. Configure plugin in `main.js`:
```javascript
import { createApp } from 'vue'
import GovUkVue from 'govuk-vue'
import App from './App.vue'

const app = createApp(App)
app.use(GovUkVue)
app.mount('#app')
```

4. Ensure proper HTML structure:
```html
<html lang="en" class="govuk-template">
  <body class="govuk-template__body">
    <script>document.body.className += ' js-enabled';</script>
    <div id="app"></div>
  </body>
</html>
```

## Common Patterns and Workflows

### Pattern 1: Question Page (One Thing Per Page)

Follow the "one thing per page" pattern for questions in a service journey:

```vue
<template>
  <div>
    <GvBackLink href="/previous-page">Back</GvBackLink>

    <GvErrorSummary
      v-if="errors.length > 0"
      title="There is a problem"
      :error-list="errors"
    />

    <form @submit.prevent="handleSubmit">
      <fieldset class="govuk-fieldset">
        <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
          <h1 class="govuk-fieldset__heading">
            [Question as H1]
          </h1>
        </legend>

        <!-- Form component here -->
      </fieldset>

      <GvButton type="submit">Continue</GvButton>
    </form>
  </div>
</template>
```

See `assets/example-templates/question-page.vue` for complete implementation.

### Pattern 2: Check Your Answers

Use before final submission to let users review their answers:

```vue
<template>
  <div>
    <GvBackLink href="/last-question">Back</GvBackLink>

    <h1 class="govuk-heading-xl">Check your answers</h1>

    <GvSummaryList :rows="summaryRows" />

    <h2 class="govuk-heading-m">Now send your application</h2>
    <p class="govuk-body">
      By submitting this application you are confirming that...
    </p>

    <GvButton @click="handleSubmit">Accept and send</GvButton>
  </div>
</template>
```

See `assets/example-templates/check-answers.vue` for complete implementation with change links.

### Pattern 3: Confirmation Page

Display after successful submission:

```vue
<template>
  <div>
    <GvPanel title="Application complete">
      Your reference number<br>
      <strong>HDJ2123F</strong>
    </GvPanel>

    <h2 class="govuk-heading-m">What happens next</h2>
    <p class="govuk-body">
      We've sent your application to...
    </p>
  </div>
</template>
```

See `assets/example-templates/confirmation.vue` for complete implementation.

### Pattern 4: Task List

For complex services with multiple sections:

See `assets/example-templates/task-list.vue` for complete implementation showing sections, progress tracking, and status tags.

### Pattern 5: Start Page

Entry point for service with clear call to action:

```vue
<template>
  <div>
    <h1 class="govuk-heading-xl">Service name</h1>
    <p class="govuk-body-l">Use this service to...</p>

    <GvButton variant="primary" is-start-button @click="start">
      Start now
    </GvButton>

    <h2 class="govuk-heading-m">Before you start</h2>
    <p class="govuk-body">You will need...</p>
  </div>
</template>
```

## Form Validation and Error Handling

Always implement comprehensive validation following these principles:

### Error Summary
Display at top of page when validation fails:

```vue
<GvErrorSummary
  v-if="errors.length > 0"
  title="There is a problem"
  :error-list="errors"
/>
```

### Individual Field Errors
Link each error to its field:

```javascript
const errors = ref([])

// Add errors
errors.value.push({
  text: 'Enter your email address',
  href: '#email'  // Links to field ID
})

// Display on field
<GvTextInput
  v-model="email"
  :error-message="getError('email')"
/>

const getError = (field) => {
  const error = errors.value.find(e => e.href === `#${field}`)
  return error ? error.text : ''
}
```

### Scroll to Errors
Always scroll to error summary on validation failure:

```javascript
if (errors.value.length > 0) {
  window.scrollTo(0, 0)
}
```

## Component Usage Guidelines

### Form Components

**Text Input:**
```vue
<GvTextInput
  v-model="value"
  label="Label text"
  hint="Help text"
  type="email"
  :width="20"
  :error-message="errorMessage"
/>
```

**Radios (single choice):**
```vue
<GvRadios
  v-model="selected"
  legend="Question"
  :items="[
    { value: 'yes', text: 'Yes' },
    { value: 'no', text: 'No' }
  ]"
/>
```

**Checkboxes (multiple choice):**
```vue
<GvCheckboxes
  v-model="selectedItems"
  legend="Select all that apply"
  :items="checkboxItems"
/>
```

**Date Input:**
```vue
<GvDateInput
  v-model="date"
  legend="What is your date of birth?"
  hint="For example, 31 3 1980"
/>
```

### Navigation Components

**Header:**
```vue
<GvHeader
  service-name="Service Name"
  service-url="/"
  :navigation="navItems"
/>
```

**Breadcrumbs:**
```vue
<GvBreadcrumbs
  :items="[
    { text: 'Home', href: '/' },
    { text: 'Section', href: '/section' },
    { text: 'Current page' }
  ]"
/>
```

**Back Link:**
```vue
<GvBackLink href="/previous">Back</GvBackLink>
```

### Content Components

**Panel (for confirmations):**
```vue
<GvPanel title="Success">
  Reference: HDJ2123F
</GvPanel>
```

**Notification Banner:**
```vue
<GvNotificationBanner type="success" title="Success">
  Your changes have been saved
</GvNotificationBanner>
```

**Warning Text:**
```vue
<GvWarningText>
  Important warning information
</GvWarningText>
```

**Details (collapsible help):**
```vue
<GvDetails summary-text="Help with this question">
  Additional help text...
</GvDetails>
```

### Layout Components

**Standard page layout:**
```vue
<GvWidthContainer>
  <GvMainWrapper>
    <!-- Page content -->
  </GvMainWrapper>
</GvWidthContainer>
```

**Two-column layout:**
```vue
<GvGridRow>
  <GvGridColumn desktop-size="two-thirds">
    <!-- Main content -->
  </GvGridColumn>
  <GvGridColumn desktop-size="one-third">
    <!-- Sidebar -->
  </GvGridColumn>
</GvGridRow>
```

## Best Practices

### Accessibility
1. Always provide labels for form inputs
2. Use hint text to provide additional context
3. Implement proper error messaging
4. Ensure logical heading hierarchy
5. Use semantic HTML through components

### Content Design
1. Use clear, simple language
2. Front-load important information
3. Follow the "one thing per page" pattern
4. Use active voice
5. Keep sentences short

### Form Design
1. Only ask for information you need
2. Make optional fields clear
3. Provide helpful hints
4. Use appropriate input types
5. Group related fields with fieldsets

### Navigation
1. Always provide a back link except on start pages
2. Show clear progress indicators
3. Allow users to check and change answers
4. Provide clear confirmation after submission

### Error Handling
1. Show error summary at top of page
2. Link errors to specific fields
3. Use clear, specific error messages
4. Tell users how to fix errors
5. Don't lose user data on validation errors

## Resources

### Reference Documentation
Detailed component reference with props and examples: `references/components.md`

This file includes:
- Complete component list organized by category
- Common props for each component
- Code examples
- Usage patterns

### Starter Template
Pre-configured Vue 3 project: `assets/starter-template/`

Includes:
- Vite configuration
- Vue Router setup
- GOV.UK Vue plugin integration
- Example pages
- Proper HTML structure

### Example Templates
Common page patterns: `assets/example-templates/`

- `question-page.vue` - Single question per page pattern
- `check-answers.vue` - Summary list with change links
- `confirmation.vue` - Success confirmation pattern
- `task-list.vue` - Multi-section task list pattern

### External Resources
- Full documentation: https://govukvue.org/
- Component examples: https://govukvue.org/components/
- GOV.UK Design System: https://design-system.service.gov.uk/
- GitHub repository: https://github.com/govuk-vue/govuk-vue

## Common Tasks

### Creating a New Service

1. Copy `assets/starter-template/` to project location
2. Update service name in `App.vue`
3. Plan service journey and create pages
4. Implement question pages following "one thing per page"
5. Add check answers page before submission
6. Create confirmation page
7. Test with keyboard navigation and screen readers

### Adding a Form

1. Create new page component
2. Import required form components
3. Set up reactive form data
4. Implement validation logic
5. Add error summary and field errors
6. Handle form submission
7. Provide clear next steps

### Implementing Validation

1. Create errors ref array
2. Check each field on submit
3. Push error objects with `text` and `href`
4. Display error summary if errors exist
5. Pass error messages to fields
6. Scroll to top on errors
7. Clear errors on successful validation

### Creating Multi-Step Journeys

1. Plan complete user journey
2. Create route for each step
3. Use state management (Pinia/Vuex) for data persistence
4. Implement navigation between steps
5. Add check answers page before final step
6. Provide confirmation page after submission
7. Allow users to go back and change answers
