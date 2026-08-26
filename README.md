# LeadFlow

LeadFlow is a full-stack CRM-style prototype for managing prospects, clients, communication and local lead research from one interface.

The repository is structured as a small monorepo with a React frontend and an Express API. The current implementation includes working client-facing flows alongside several prototype sections that are still being developed.

## Features

- Dashboard and client management views
- Individual client detail pages
- Messages and email sections
- Maps/local lead research section
- Settings and login screens
- REST API routes for clients and messages
- Places search/import endpoints
- CSV export support
- Internationalization support with `i18next`
- Responsive UI built with `styled-components`

## Tech stack

### Frontend

- React 18
- TypeScript
- Vite
- React Router
- Axios
- styled-components
- i18next / react-i18next

### Backend

- Node.js
- Express
- TypeScript
- CORS
- dotenv
- node-fetch

## Project structure

```text
LeadFlow/
├── apps/
│   ├── web/                 # React + Vite frontend
│   │   └── src/
│   │       ├── api/         # API client helpers
│   │       ├── components/  # Shared UI components
│   │       ├── i18n/        # Translation setup
│   │       ├── pages/       # Application pages
│   │       ├── styles/      # Shared styling
│   │       └── types/       # TypeScript types
│   └── server/              # Express API
│       └── src/
│           ├── db/          # Data access / local data layer
│           ├── routes/      # API routes
│           ├── env.ts       # Environment configuration
│           └── index.ts     # Server entry point
├── netlify.toml
└── package.json             # Root development scripts
```

## Local development

### Prerequisites

- Node.js 18+ recommended
- npm

### Install dependencies

The frontend and backend keep their own dependency manifests, so install dependencies in all three locations:

```bash
npm install
npm --prefix apps/web install
npm --prefix apps/server install
```

### Environment variables

The server reads the following variables:

```env
PORT=3001
ALLOWED_ORIGIN=http://localhost:5173
GOOGLE_API_KEY=your_google_api_key
```

`PORT` and `ALLOWED_ORIGIN` have local defaults. `GOOGLE_API_KEY` is only needed for functionality that uses the Google Places integration. Never commit real API keys to the repository.

### Start frontend and backend together

```bash
npm run dev
```

This starts:

- frontend: Vite development server
- backend: Express server with TypeScript watch mode

You can also run them separately:

```bash
npm run dev:web
npm run dev:server
```

## Build

```bash
npm run build:web
npm run build:server
```

## Main application routes

The current frontend exposes routes for:

- `/` — dashboard
- `/clients` — client list
- `/clients/:id` — client details
- `/messages` — messages
- `/email` — email section
- `/maps` — map/local lead tools
- `/settings` — settings
- `/login` — login screen

## Current status

LeadFlow is a portfolio and development project rather than a finished production CRM. Some modules are more complete than others, and authentication, persistence and external integrations should be reviewed before any production deployment.

## Security note

Do not commit `.env` files, API keys, access tokens, client secrets or private customer data. Use environment variables for external-service credentials and replace sensitive data with demo fixtures when sharing the project publicly.
