# G.P. Porwal College - Premium Institutional SaaS Platform

This is the fully dynamic, database-driven React + Vite frontend for the GPPVVS College platform, completely rebuilt from the legacy `index.aspx` static site.

## Tech Stack
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router DOM v7
- **SEO**: React Helmet Async
- **HTTP Client**: Axios (configured in `src/api/client.ts`)

## Features
- **Dynamic Routing**: Pages, departments, and infrastructure components dynamically fetch their structure and content via the backend API.
- **Nested Navigation**: The main navbar supports infinite recursive depth for complex institutional hierarchies (e.g. `Student Corner -> Cells -> SC/ST Cell`).
- **Full Admin CMS**: Includes a complete internal dashboard (`/admin`) to manage:
  - Homepage sections and Hero sliders
  - Departments & Faculty
  - Notices & Events
  - NAAC Documents & Quality Assurance Reports
  - Committees & Cells
  - Dynamic Nested Menus
  - Institutional Settings

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

3. Run the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Security & Polish
- Implemented responsive design across all viewports (`sm`, `md`, `lg`, `xl`).
- Handled access token rotation via Axios interceptors.
- Used semantic HTML and `helmet` for full on-page SEO capability per-route.
