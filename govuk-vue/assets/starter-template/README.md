# GOV.UK Vue Starter Template

A minimal starter template for building services with GOV.UK Vue.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── main.js          # Application entry point with router setup
├── App.vue          # Root component with header, footer, and layout
└── pages/           # Page components
    ├── HomePage.vue   # Example home page with start button
    └── FormPage.vue   # Example form with validation
```

## Features Included

- Vue Router for navigation
- GOV.UK Vue components
- GOV.UK Frontend CSS
- Example pages demonstrating:
  - Start page pattern
  - Form validation with error summary
  - Navigation between pages

## Next Steps

Customize this template by:
- Adding more pages to `src/pages/`
- Updating the service name in `App.vue`
- Adding your own components
- Configuring the router in `main.js`
