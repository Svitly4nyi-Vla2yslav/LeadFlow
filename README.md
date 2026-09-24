# LeadFlow

LeadFlow is a full-stack CRM for managing VS Web Studio prospects, clients, communication and local lead research from one interface.

The repository is structured as a small monorepo with a React frontend and an Express API. The current single-user CRM flow includes server-side password protection, persistent local JSON storage and Netlify Blobs persistence; managed multi-user identity, relational storage and outbound integrations remain future production work.

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
- Internationalization support with `i18next`
- Responsive UI built with `styled-components`
- One shared CRM pipeline: `NEW`, `AUDITED`, `CONTACTED`, `REPLY`, `CALL`, `OFFER`, `FOLLOW-UP`, `WON`, `LOST`
- Evidence validation before status changes, approved lost reasons, status history, CSV export and funnel dashboard
- Authenticated Voice Agent contract v1 receiver with durable event idempotency and CRM-owned status decisions
- Secure client-to-Voice-Agent handoff using exact canonical lead IDs and short-lived signed tokens
- Persistent outbound CallTasks with readiness validation, guarded lifecycle transitions and sanitized Call Briefs

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
ALLOW_DEV_AUTH_BYPASS=false
VOICE_AGENT_INTEGRATION_TOKEN=replace-with-at-least-32-random-characters
VOICE_AGENT_APP_URL=http://localhost:3002
SESSION_HOURS=12
```

`ADMIN_PASSWORD` must contain at least 12 characters or the private entrance remains disabled. `SESSION_SECRET` signs portable sessions and purpose-scoped Voice Agent handoffs across serverless instances and should be a separate random secret in production. `ALLOW_DEV_AUTH_BYPASS` is parsed by the server and defaults to `false`. `VOICE_AGENT_INTEGRATION_TOKEN` is a separate server-only bearer token of at least 32 characters; never expose it to the frontend or reuse the admin password/session secret. `VOICE_AGENT_APP_URL` is the non-secret Voice Agent application origin opened by the CRM; it defaults to `http://localhost:3002` for local development and must be set to the deployed HTTPS origin in production. `PORT` and `ALLOWED_ORIGIN` have local defaults. `GOOGLE_API_KEY` is only needed for Google Places. `LEADFLOW_DATA_FILE` controls the local Express JSON store; Netlify production hydrates and persists the CRM document through Netlify Blobs instead, so the local file path is not the durable production datastore. Never commit real passwords or API keys.

### Passwordless local owner access

For local development only, set the following server environment value:

```env
ALLOW_DEV_AUTH_BYPASS=true
```

Start LeadFlow, then click or tap the hidden screw five times within four seconds. The backend issues the same signed HttpOnly owner-session cookie used by normal login and the CRM opens immediately without showing the password dialog. If the bypass is disabled or unavailable, the existing password dialog remains the fallback.

Never enable `ALLOW_DEV_AUTH_BYPASS` in production. The server rejects `/api/auth/dev-unlock` whenever `NODE_ENV=production`, even if the flag is accidentally set to `true`; production continues to use `ADMIN_PASSWORD` and signed sessions.

## Voice Agent integration

The VS AI Voice Agent reports confirmed interaction facts to `POST /api/integrations/voice-agent/interactions`. It authenticates with `Authorization: Bearer <VOICE_AGENT_INTEGRATION_TOKEN>` and does not need or use the human browser session cookie. The two projects do not share database access: LeadFlow is the authoritative CRM receiver and is solely responsible for deciding whether evidence permits a status transition.

Contract `VoiceAgentInteractionV1` uses `contractVersion: "1.0"`, source `vs-ai-voice-agent`, the canonical `Client.id` in `leadRef.leadId`, an RFC3339 `occurredAt`, and a structured outbound phone interaction. Optional next-action, follow-up, calendar, and approved lost-reason facts are strictly validated; unknown fields and malformed dates are rejected. The receiver never fuzzy-matches or creates leads, and it never accepts a requested CRM status.

`eventId` is the durable UUID idempotency key. Replaying equivalent normalized content returns `duplicate: true` without creating another interaction, message, history item, or follow-up update. Reusing the ID with different content returns `409 event_conflict`. Accepted events create one structured `VoiceInteraction` and one existing contact-journal `Message`; no audio, full transcript, prompts, credentials, or tool internals are stored.

In Netlify production, `voiceInteractions` is included alongside clients and messages in the strongly read, ETag/`onlyIfMatch`-protected Blobs snapshot. Configure a unique `VOICE_AGENT_INTEGRATION_TOKEN` in the Netlify server environment before enabling the sender.

### Phase 5A verification

LeadFlow is the CRM authority: the Voice Agent reports confirmed interaction facts, while LeadFlow validates those facts and decides whether they justify a CRM state transition. Automated receiver coverage verifies strict authentication/schema handling, exact German UTF-8 storage (`ä`, `ö`, `ü`, `ß`), timeline writeback, conservative status mapping, idempotent retries, event conflicts, terminal-status safety, and Netlify persistence wiring.

An operator can exercise the local receiver against an existing canonical lead with the guarded HTTP test:

```bash
npm --prefix apps/server run voice:integration-test -- --lead-id=<LEAD_ID> --confirm-write
```

The command reads `VOICE_AGENT_INTEGRATION_TOKEN` from `apps/server/.env`, generates a fresh event UUID, submits one non-destructive `CALL_COMPLETED` fact with confirmed next-action evidence, verifies the identical retry, then verifies that changed content produces `409 event_conflict`. It never prints the token and performs no request unless both `--lead-id` and `--confirm-write` are supplied. The local API defaults to `http://localhost:3001`; use `--base-url=<URL>` only when intentionally testing another receiver.

### Phase 5C lead handoff

The client detail page now provides **Mit Emma anrufen**. The secure flow is:

```text
LeadFlow client
  -> Call with Emma
  -> signed, short-lived handoff
  -> Voice Agent
  -> server-to-server resolve
  -> canonical LeadFlow Client.id
```

The authenticated browser sends only the currently selected `Client.id` to `POST /api/voice-agent/handoff`. LeadFlow verifies that exact ID, signs a five-minute token containing only its version, canonical lead ID, issue/expiry times and a random nonce, and returns the token with the non-secret `VOICE_AGENT_APP_URL`. The browser opens the Voice Agent with the token in the `handoff` query parameter; no customer name, phone, email, notes, or integration credential is placed in the URL.

The Voice Agent backend must exchange the handoff through `POST /api/integrations/voice-agent/resolve-handoff` using `Authorization: Bearer <VOICE_AGENT_INTEGRATION_TOKEN>`. LeadFlow validates the bearer token, HMAC signature, lifetime, exact lead existence and then returns only `id`, `company`, `contactPerson`, `phone`, `email`, and `crmStatus`. It never returns notes, timelines, messages, VoiceInteractions, lost history, or credentials.

LeadFlow creates and owns every lead ID. Emma never generates, guesses, fuzzy-matches, or substitutes a company, email, or phone number for an ID. Phase 5C-B in the Voice Agent repository must read the `handoff` query parameter, send it only from its backend to the resolve endpoint with the server-only integration bearer token, keep the token out of logs, handle invalid/expired/not-found responses, and bind the resolved exact ID to subsequent Phase 5A interaction events.

### Phase 5D-A — Call Orchestration Foundation

LeadFlow is now the control plane and source of truth for outbound call preparation:

```text
LeadFlow
  -> canonical Client
  -> persistent CallTask
  -> sanitized Call Brief
  -> existing Emma handoff
  -> future telephony and post-call writeback
```

A `CallTask` references exactly one existing `Client.id`; it does not duplicate the lead record. The current lead supplies the phone and business context, while the task stores the call objective, optional offer focus/operator note, schedule and independent call lifecycle. CRM pipeline status and CallTask status are separate domains.

Tasks are created as `READY` only when the canonical lead exists, the stored phone is potentially usable and a call objective is present. Otherwise they remain `DRAFT` with explicit readiness issues. Phone values are retained exactly as entered; Phase 5D-A performs no country inference or E.164 rewriting. The state machine permits only `DRAFT -> READY`, `READY -> CANCELLED|FAILED|DIALING`, `DIALING -> IN_PROGRESS|FAILED`, and `IN_PROGRESS -> COMPLETED|FAILED`. Provider-only transitions are prepared in the domain layer but are not exposed to the owner UI in this phase.

Authenticated owner endpoints are available at `POST/GET /api/call-tasks`, `GET/PATCH /api/call-tasks/:id`, `POST /api/call-tasks/:id/cancel`, and `GET /api/call-tasks/:id/brief`. The brief is generated server-side from the current lead plus task-specific fields and excludes CRM notes, timelines, messages and hidden metadata. CallTasks are included in both local atomic JSON persistence and Netlify Blob hydrate/snapshot writes.

The client detail page provides an **Emma Anruf** preparation form and Call Brief preview. Once a task is ready, **Mit Emma anrufen** continues to use the existing Phase 5C browser handoff. Phase 5D-A deliberately does not add `callTaskId` to that token and does not implement Twilio, SIP, dialing or any other real telephone operation. Emma does not choose who to call; LeadFlow binds the canonical lead and owns the call lifecycle.

### Phase 5D-UX — Mobile control plane

LeadFlow is mobile-first from approximately 360 px while retaining its desktop sidebar and tables. Phones use a safe-area-aware bottom navigation for Dashboard, Leads, Calls, Messages and Settings. The Leads page renders touch-friendly cards on mobile, keeps the desktop table at larger widths, and provides progressive Basic, Context and Emma lead-creation sections.

Lead intake now supports the structured optional fields `source`, `preferredLanguage`, `decisionMaker`, `currentSituation`, `painPoints`, `emmaFocus`, `offerFocus` and `doNotMention`. **Save lead** performs a normal canonical create/update. **Save & prepare Emma call** first persists the lead, uses the returned canonical UUID, then creates a CallTask; missing phone or objective produces a durable DRAFT with explicit readiness issues rather than inventing data or launching Emma.

The Lead management area accepts JSON arrays (or `{ "leads": [...] }`) and CSV files in the browser, displays detected columns and a preview, and submits normalized rows to the existing `/api/clients/import` endpoint. Duplicate protection and the 1,000-row server limit remain authoritative. CSV export includes the new context fields while preserving existing columns.

All main application views, navigation, form labels, state labels, errors and empty states use complete DE/UK/RU i18next resources; Ukrainian remains the default and the selected language is stored locally. Canonical CRM, CallTask, channel and lost-reason values remain unchanged in storage and are translated only for display.

CallTask results now have backward-compatible optional fields for client need, confirmed pain points, interest, objections, budget, decision-maker status, requested information, callback, meeting details, lost reason and do-not-contact. Client detail renders the latest available result as a localized scan-friendly feedback card. This phase does not populate feedback automatically or send the added LeadFlow context externally.

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

Build both applications with the root script:

```bash
npm run build
```

This runs `build:web` first and then `build:server`. The individual commands remain available when only one side needs to be checked:

```bash
npm run build:web
npm run build:server
```

## Netlify production

Netlify serves the Vite application and routes `/api/*` to the bundled Express function. The function keeps the CRM document in the site-wide `leadflow-crm` Netlify Blobs store and uses strong API reads plus ETag-protected writes, so production no longer depends on a visitor's `localhost:3001` and concurrent updates cannot silently overwrite each other.

Configure `ADMIN_PASSWORD`, `SESSION_SECRET`, `VOICE_AGENT_INTEGRATION_TOKEN`, `VOICE_AGENT_APP_URL`, `SESSION_HOURS` and `ALLOWED_ORIGIN` in Netlify environment variables before deployment. Production sessions are signed HttpOnly cookies and remain valid across function instances. `VOICE_AGENT_APP_URL` is safe to return to an authenticated browser; the integration token and signing secret remain server-only. No secret is stored in `netlify.toml`.

## Verification workflow

Run the automated server/CRM tests followed by both production builds:

```bash
npm run check
```

The root `check` command is the preferred pre-push verification because it executes `npm run test` and then the combined `npm run build`.

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

- relational or transactional multi-user storage if the app grows beyond the current single-user local JSON / Netlify Blobs model
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
