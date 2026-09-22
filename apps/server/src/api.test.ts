import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import type { Server } from 'node:http';

const temporaryDirectory = mkdtempSync(join(tmpdir(), 'leadflow-api-'));
process.env.LEADFLOW_DATA_FILE = join(temporaryDirectory, 'leadflow.json');
process.env.ADMIN_PASSWORD = 'test-only-long-password';
process.env.VOICE_AGENT_INTEGRATION_TOKEN = 'test-only-voice-token-with-32-characters';

let server: Server;
let baseUrl = '';
let sessionCookie = '';

const withSession = (options: RequestInit = {}): RequestInit => ({
  ...options,
  headers: { ...options.headers, cookie: sessionCookie }
});

const voiceHeaders = (token = process.env.VOICE_AGENT_INTEGRATION_TOKEN!) => ({
  'content-type': 'application/json',
  authorization: `Bearer ${token}`
});

const voicePayload = (leadId: string, overrides: Record<string, unknown> = {}) => ({
  contractVersion: '1.0',
  eventId: randomUUID(),
  source: 'vs-ai-voice-agent',
  leadRef: { leadId },
  occurredAt: '2026-09-22T10:00:00.000Z',
  interaction: {
    channel: 'phone/cold call',
    direction: 'out',
    summary: 'Reached the business and recorded the confirmed call result.',
    outcome: 'NO_ANSWER'
  },
  ...overrides
});

const createLead = async (company: string, crmStatus = 'NEW', extra: Record<string, unknown> = {}) => {
  const response = await fetch(`${baseUrl}/api/clients`, withSession({
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ company, crmStatus, ...extra })
  }));
  assert.equal(response.status, 201);
  return await response.json() as { id: string };
};

before(async () => {
  const { default: app } = await import('./app');
  await new Promise<void>(resolve => {
    server = app.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') throw new Error('Test server has no TCP address');
      baseUrl = `http://127.0.0.1:${address.port}`;
      resolve();
    });
  });
});

after(async () => {
  await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  rmSync(temporaryDirectory, { recursive: true, force: true });
});

test('health endpoint reports persistent storage', async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, storage: 'persistent-json' });
});

test('CRM API is hidden behind a rate-limited server session', async () => {
  const blocked = await fetch(`${baseUrl}/api/clients`);
  assert.equal(blocked.status, 401);

  const denied = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password: 'wrong-password' })
  });
  assert.equal(denied.status, 401);

  const login = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password: 'test-only-long-password' })
  });
  assert.equal(login.status, 200);
  sessionCookie = (login.headers.get('set-cookie') || '').split(';')[0];
  assert.match(sessionCookie, /^leadflow_session=/);

  const session = await fetch(`${baseUrl}/api/auth/session`, withSession());
  assert.deepEqual(await session.json(), { authenticated: true, configured: true });
});

test('lead API creates, validates, updates and reports dashboard history', async () => {
  const createdResponse = await fetch(`${baseUrl}/api/clients`, withSession({
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ company: 'API Test GmbH', crmStatus: 'NEW' })
  }));
  assert.equal(createdResponse.status, 201);
  const created = await createdResponse.json() as { id: string };

  const invalidResponse = await fetch(`${baseUrl}/api/clients/${created.id}`, withSession({
    method: 'PATCH', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ crmStatus: 'AUDITED' })
  }));
  assert.equal(invalidResponse.status, 400);

  const auditedResponse = await fetch(`${baseUrl}/api/clients/${created.id}`, withSession({
    method: 'PATCH', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ crmStatus: 'AUDITED', auditProblem: 'CTA is hidden below the mobile fold.', proposedSolution: 'Place a sticky contact CTA.' })
  }));
  assert.equal(auditedResponse.status, 200);

  const dashboard = await (await fetch(`${baseUrl}/api/dashboard`, withSession())).json() as { counts: Record<string, number> };
  assert.equal(dashboard.counts.AUDITED, 1);
});

test('canonical bulk import skips duplicates', async () => {
  const response = await fetch(`${baseUrl}/api/clients/import`, withSession({
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ leads: [{ Company: 'Import GmbH', Ort: 'Hildesheim', 'CRM Status': 'NEW' }, { Company: 'Import GmbH', Ort: 'Hildesheim', 'CRM Status': 'NEW' }] })
  }));
  assert.equal(response.status, 200);
  const result = await response.json() as { created: number; skipped: number };
  assert.deepEqual(result, { created: 1, skipped: 1, errors: [] });
});

test('voice integration requires its bearer token, not a browser session', async () => {
  const lead = await createLead('Voice Auth GmbH');
  const payload = voicePayload(lead.id);

  const missing = await fetch(`${baseUrl}/api/integrations/voice-agent/interactions`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload)
  });
  assert.equal(missing.status, 401);

  const invalid = await fetch(`${baseUrl}/api/integrations/voice-agent/interactions`, {
    method: 'POST', headers: voiceHeaders('invalid-token-that-is-not-the-secret'), body: JSON.stringify(payload)
  });
  assert.equal(invalid.status, 401);

  const accepted = await fetch(`${baseUrl}/api/integrations/voice-agent/interactions`, {
    method: 'POST', headers: voiceHeaders(), body: JSON.stringify(payload)
  });
  assert.equal(accepted.status, 201);
  const result = await accepted.json() as { ok: boolean; duplicate: boolean; crmStatusAfter: string };
  assert.deepEqual(result, { ...result, ok: true, duplicate: false, crmStatusAfter: 'CONTACTED' });
});

test('voice integration validates schema and canonical lead ID', async () => {
  const missingLead = await fetch(`${baseUrl}/api/integrations/voice-agent/interactions`, {
    method: 'POST', headers: voiceHeaders(), body: JSON.stringify(voicePayload(randomUUID()))
  });
  assert.equal(missingLead.status, 404);

  const lead = await createLead('Voice Validation GmbH');
  const malformed = await fetch(`${baseUrl}/api/integrations/voice-agent/interactions`, {
    method: 'POST', headers: voiceHeaders(), body: JSON.stringify(voicePayload(lead.id, { occurredAt: 'not-a-date' }))
  });
  assert.equal(malformed.status, 400);

  const extraField = await fetch(`${baseUrl}/api/integrations/voice-agent/interactions`, {
    method: 'POST', headers: voiceHeaders(), body: JSON.stringify({ ...voicePayload(lead.id), desiredStatus: 'WON' })
  });
  assert.equal(extraField.status, 400);

  const unconfirmedMeeting = await fetch(`${baseUrl}/api/integrations/voice-agent/interactions`, {
    method: 'POST', headers: voiceHeaders(), body: JSON.stringify(voicePayload(lead.id, {
      interaction: { channel: 'phone/cold call', direction: 'out', summary: 'Meeting discussed but not booked.', outcome: 'MEETING_BOOKED' },
      calendar: { confirmed: false }
    }))
  });
  assert.equal(unconfirmedMeeting.status, 400);
});

test('voice integration is durable-idempotent and creates one journal message', async () => {
  const lead = await createLead('Voice Idempotency GmbH');
  const payload = voicePayload(lead.id);
  const send = (body: unknown) => fetch(`${baseUrl}/api/integrations/voice-agent/interactions`, {
    method: 'POST', headers: voiceHeaders(), body: JSON.stringify(body)
  });

  assert.equal((await send(payload)).status, 201);
  const retry = await send(payload);
  assert.equal(retry.status, 200);
  assert.equal((await retry.json() as { duplicate: boolean }).duplicate, true);

  const conflict = await send({ ...payload, interaction: { ...payload.interaction, summary: 'Changed content.' } });
  assert.equal(conflict.status, 409);
  assert.equal((await conflict.json() as { error: string }).error, 'event_conflict');

  const detail = await (await fetch(`${baseUrl}/api/clients/${lead.id}`, withSession())).json() as { messages: Array<{ body: string }>; statusHistory: unknown[] };
  assert.equal(detail.messages.length, 1);
  assert.equal(detail.statusHistory.length, 2);
});

test('confirmed meeting stores its calendar reference', async () => {
  const lead = await createLead('Voice Meeting GmbH');
  const payload = voicePayload(lead.id, {
    interaction: { channel: 'phone/cold call', direction: 'out', summary: 'Client confirmed a discovery meeting.', outcome: 'MEETING_BOOKED' },
    calendar: { confirmed: true, eventId: 'calendar-event-1', start: '2026-09-24T10:00:00Z', end: '2026-09-24T10:30:00Z', meetingMode: 'GOOGLE_MEET' }
  });
  const response = await fetch(`${baseUrl}/api/integrations/voice-agent/interactions`, {
    method: 'POST', headers: voiceHeaders(), body: JSON.stringify(payload)
  });
  assert.equal(response.status, 201);
  const body = await response.json() as { appliedChanges: string[]; crmStatusAfter: string };
  assert.equal(body.crmStatusAfter, 'CALL');
  assert.ok(body.appliedChanges.includes('calendar_reference_recorded'));

  const { db } = await import('./db/memory');
  const stored = db.voiceInteractions.find(item => item.eventId === payload.eventId);
  assert.equal(stored?.calendarEventId, 'calendar-event-1');
});
