# LeadFlow

LeadFlow is a full-stack CRM for managing VS Web Studio prospects, clients, communication and local lead research from one interface.

The repository is structured as a small monorepo with a React frontend and an Express API. The core local single-user CRM flow is working; authentication, cloud storage and outbound integrations remain production work.

The current project review and completion plan are documented in [docs/PROJECT_STATUS_UA.md](docs/PROJECT_STATUS_UA.md).

## Features

- Dashboard and client management views
- Individual client detail pages
- Messages and email sections
- Maps/local lead research section
- Persistent local JSON storage with atomic writes
- Search, status filtering and overdue follow-up filtering
- Lead detail editor, contact journal and unified timeline
- Canonical JSON import and CSV export
- Automated CRM validation tests and GitHub Actions CI
- Public launch countdown with the animated VS Web Studio gold mark
- Hidden owner entry backed by server-side password verification, HttpOnly sessions and login throttling
- REST API routes for clients and messages
- Places search/import endpoints
- CSV export support
- Internationalization support with `i18next`
- Responsive UI built with `styled-components`
- One shared CRM pipeline: `NEW`, `AUDITED`, `CONTACTED`, `REPLY`, `CALL`, `OFFER`, `FOLLOW-UP`, `WON`, `LOST`
- Evidence validation before status changes, approved lost reasons, status history, CSV export and funnel dashboard

## CRM standard

Every lead has exactly one current CRM status. Status changes must reflect an actual event and are rejected when the required evidence is missing. In particular, `AUDITED` requires a concrete confirmed audit point; `CONTACTED` requires date, channel and contact summary; `OFFER` requires amount and offer details; `FOLLOW-UP` requires a next follow-up date; and `LOST` requires one of the approved lost reasons.

The canonical export columns are: Lead ID, Company, Branche, Ort, Website, Contact Person, Phone, Email, CRM Status, Audit Problem, Proposed Solution, Contact Channel, Last Contact Date, Next Follow-up Date, Offer Amount, Lost Reason and Notes.

Dashboard conversion rates use recorded status history rather than inferring past events from the current status.

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

## Architecture and data flow

LeadFlow separates the browser UI and API into two applications:

1. `apps/web` renders the React interface and calls the backend through API helpers.
2. `apps/server` exposes the REST endpoints and external-service integration points.
3. The local data layer is implemented in `apps/server/src/db/memory.ts` and persists atomically to `apps/server/data/leadflow.json` by default. That file is private and Git-ignored.
4. Google Places functionality is enabled only when a `GOOGLE_API_KEY` is supplied to the server environment.

This separation keeps the frontend independent from the storage implementation and leaves a clear migration path to PostgreSQL. The JSON store is suitable for local single-user use, not concurrent production instances.

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
│           ├── db/          # Persistent local data layer
│           ├── crm.ts       # Canonical sanitization and evidence rules
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
LEADFLOW_DATA_FILE=data/leadflow.json
ADMIN_PASSWORD=replace-with-a-long-unique-password
SESSION_SECRET=replace-with-at-least-32-random-characters
SESSION_HOURS=12
```

`ADMIN_PASSWORD` must contain at least 12 characters or the private entrance remains disabled. `SESSION_SECRET` signs portable sessions across serverless instances and should be a separate random secret in production. `PORT` and `ALLOWED_ORIGIN` have local defaults. `GOOGLE_API_KEY` is only needed for Google Places. Never commit real passwords or API keys.

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

## Netlify production

Netlify serves the Vite application and routes `/api/*` to the bundled Express function. The function keeps the CRM JSON document in the site-wide `leadflow-crm` Netlify Blobs store, so production no longer depends on a visitor's `localhost:3001`.

Configure `ADMIN_PASSWORD`, `SESSION_SECRET`, `SESSION_HOURS` and `ALLOWED_ORIGIN` in Netlify environment variables before deployment. Production sessions are signed HttpOnly cookies and remain valid across function instances.

## Verification workflow

Run the automated CRM/API tests and both production builds:

```bash
npm run check
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
- unauthorized visitors see only the launch countdown; the CRM routes render only after a valid server session

## Production gaps

Before treating LeadFlow as a production CRM, the following areas need explicit implementation or review:

- PostgreSQL or equivalent multi-user database instead of the local JSON store
- managed identity provider, roles and persistent sessions if the CRM becomes multi-user
- validation and error handling at API boundaries
- secure handling of external-service credentials
- rate limiting and abuse protection for public endpoints
- privacy/retention rules for customer and prospect data
- automated tests for critical client and message workflows
- deployment-specific CORS and environment configuration

## Current status

LeadFlow now works as a local or Netlify-hosted single-user CRM with the canonical VS Web Studio pipeline, protected API and persistent storage. It is not yet a multi-user CRM; roles, managed identity/2FA, relational storage, tested backups, privacy rules and external communication integrations remain future production work.

## Security note

Do not commit `.env` files, API keys, access tokens, client secrets or private customer data. Use environment variables for external-service credentials and replace sensitive data with demo fixtures when sharing the project publicly.
