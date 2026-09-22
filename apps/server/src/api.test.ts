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

const sendVoiceInteraction = (payload: unknown) => fetch(`${baseUrl}/api/integrations/voice-agent/interactions`, {
  method: 'POST', headers: voiceHeaders(), body: JSON.stringify(payload)
});

const getLeadDetail = async (leadId: string) => {
  const response = await fetch(`${baseUrl}/api/clients/${leadId}`, withSession());
  assert.equal(response.status, 200);
  return await response.json() as {
    id: string;
    crmStatus: string;
    nextFollowUpDate?: string;
    messages: Array<{ body: string }>;
    statusHistory: Array<{ status: string }>;
  };
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
  const { db } = await import('./db/memory');

  assert.equal((await sendVoiceInteraction(payload)).status, 201);
  const afterFirst = await getLeadDetail(lead.id);
  const interactionsAfterFirst = db.voiceInteractions.filter(item => item.leadId === lead.id).length;
  const retry = await sendVoiceInteraction(payload);
  assert.equal(retry.status, 200);
  assert.equal((await retry.json() as { duplicate: boolean }).duplicate, true);
  assert.equal(db.voiceInteractions.filter(item => item.leadId === lead.id).length, interactionsAfterFirst);
  assert.deepEqual(await getLeadDetail(lead.id), afterFirst);

  const conflict = await sendVoiceInteraction({ ...payload, interaction: { ...payload.interaction, summary: 'Changed content.' } });
  assert.equal(conflict.status, 409);
  assert.equal((await conflict.json() as { error: string }).error, 'event_conflict');
  assert.equal(db.voiceInteractions.filter(item => item.leadId === lead.id).length, interactionsAfterFirst);
  const afterConflict = await getLeadDetail(lead.id);
  assert.deepEqual(afterConflict, afterFirst);
  assert.equal(afterConflict.messages.length, 1);
  assert.equal(afterConflict.statusHistory.length, 2);
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

test('German UTF-8 survives request validation, VoiceInteraction persistence and timeline writeback', async () => {
  const summary = [
    'Testgespräch durchgeführt.',
    'Kunde interessiert sich für eine neue Webseite.',
    'Nächster Schritt ist eine Beratung.',
    'Außerdem möchte der Kunde über KI-Automatisierung sprechen.'
  ].join('\n');
  const lead = await createLead('UTF-8 Prüfung GmbH');
  const payload = voicePayload(lead.id, {
    interaction: { channel: 'phone/cold call', direction: 'out', summary, outcome: 'CALL_COMPLETED' },
    nextAction: { type: 'MEETING', confirmed: true, note: 'Beratung als nächster Schritt bestätigt' }
  });

  const response = await sendVoiceInteraction(payload);
  assert.equal(response.status, 201);
  const result = await response.json() as { crmStatusBefore: string; crmStatusAfter: string; appliedChanges: string[] };
  assert.equal(result.crmStatusBefore, 'NEW');
  assert.equal(result.crmStatusAfter, 'CALL');
  assert.deepEqual(result.appliedChanges, ['message_added', 'last_contact_updated', 'crm_status_changed']);

  const { db } = await import('./db/memory');
  const storedInteraction = db.voiceInteractions.find(item => item.eventId === payload.eventId);
  const storedMessage = db.messages.find(item => item.clientId === lead.id);
  assert.equal(storedInteraction?.summary, summary);
  assert.equal(storedMessage?.body, summary);
  for (const character of ['ä', 'ö', 'ü', 'ß']) {
    assert.ok(storedInteraction?.summary.includes(character));
    assert.ok(storedMessage?.body.includes(character));
  }
  assert.equal(storedInteraction?.summary.includes('\uFFFD'), false);
  assert.equal(storedMessage?.body.includes('\uFFFD'), false);
});

test('CALL_COMPLETED keeps NEW without confirmed next action and establishes CALL with confirmed evidence', async () => {
  const unconfirmedLead = await createLead('Unconfirmed Call GmbH');
  const unconfirmedPayload = voicePayload(unconfirmedLead.id, {
    interaction: { channel: 'phone/cold call', direction: 'out', summary: 'Gespräch beendet, aber kein nächster Schritt bestätigt.', outcome: 'CALL_COMPLETED' },
    nextAction: { type: 'MEETING', confirmed: false, note: 'Noch nicht bestätigt' }
  });
  const unconfirmedResponse = await sendVoiceInteraction(unconfirmedPayload);
  assert.equal(unconfirmedResponse.status, 201);
  const unconfirmedResult = await unconfirmedResponse.json() as { crmStatusBefore: string; crmStatusAfter: string; appliedChanges: string[] };
  assert.equal(unconfirmedResult.crmStatusBefore, 'NEW');
  assert.equal(unconfirmedResult.crmStatusAfter, 'NEW');
  assert.equal(unconfirmedResult.appliedChanges.includes('crm_status_changed'), false);

  const confirmedLead = await createLead('Confirmed Call GmbH');
  const confirmedPayload = voicePayload(confirmedLead.id, {
    interaction: { channel: 'phone/cold call', direction: 'out', summary: 'Kundenbedarf und Beratung wurden besprochen.', outcome: 'CALL_COMPLETED' },
    nextAction: { type: 'MEETING', confirmed: true, note: 'Beratung als nächster Schritt bestätigt' }
  });
  const confirmedResponse = await sendVoiceInteraction(confirmedPayload);
  assert.equal(confirmedResponse.status, 201);
  const confirmedResult = await confirmedResponse.json() as { crmStatusBefore: string; crmStatusAfter: string; appliedChanges: string[] };
  assert.equal(confirmedResult.crmStatusBefore, 'NEW');
  assert.equal(confirmedResult.crmStatusAfter, 'CALL');
  for (const change of ['message_added', 'last_contact_updated', 'crm_status_changed']) {
    assert.ok(confirmedResult.appliedChanges.includes(change));
  }
});

test('confirmed callback establishes FOLLOW-UP once while an unconfirmed callback does not', async () => {
  const confirmedLead = await createLead('Confirmed Callback GmbH', 'CALL', {
    lastContactDate: '2026-09-22', notes: 'Call, need and next action confirmed.'
  });
  const confirmedPayload = voicePayload(confirmedLead.id, {
    interaction: { channel: 'phone/cold call', direction: 'out', summary: 'Kunde bittet um einen Rückruf.', outcome: 'CALLBACK_REQUESTED' },
    followUp: { requested: true, confirmed: true, date: '2026-09-29', reason: 'Kunde möchte erneut über die Webseite sprechen.' }
  });
  assert.equal((await sendVoiceInteraction(confirmedPayload)).status, 201);
  const confirmedDetail = await getLeadDetail(confirmedLead.id);
  assert.equal(confirmedDetail.crmStatus, 'FOLLOW-UP');
  assert.equal(confirmedDetail.nextFollowUpDate, '2026-09-29');
  assert.equal(confirmedDetail.statusHistory.length, 2);

  const unconfirmedLead = await createLead('Unconfirmed Callback GmbH', 'CALL', {
    lastContactDate: '2026-09-22', notes: 'Call, need and next action confirmed.'
  });
  const unconfirmedPayload = voicePayload(unconfirmedLead.id, {
    interaction: { channel: 'phone/cold call', direction: 'out', summary: 'Ein möglicher Rückruf wurde erwähnt.', outcome: 'CALLBACK_REQUESTED' },
    followUp: { requested: true, confirmed: false, date: '2026-09-29', reason: 'Noch nicht bestätigt.' }
  });
  assert.equal((await sendVoiceInteraction(unconfirmedPayload)).status, 201);
  const unconfirmedDetail = await getLeadDetail(unconfirmedLead.id);
  assert.equal(unconfirmedDetail.crmStatus, 'CALL');
  assert.equal(unconfirmedDetail.nextFollowUpDate, undefined);
  assert.equal(unconfirmedDetail.statusHistory.length, 1);
});

test('confirmed MEETING_BOOKED persists normalized calendar facts and establishes only CALL', async () => {
  const lead = await createLead('Confirmed Calendar GmbH');
  const payload = voicePayload(lead.id, {
    interaction: { channel: 'phone/cold call', direction: 'out', summary: 'Beratungstermin wurde verbindlich gebucht.', outcome: 'MEETING_BOOKED' },
    nextAction: { type: 'MEETING', confirmed: true },
    calendar: {
      confirmed: true,
      eventId: 'google-calendar-test-event',
      start: '2026-09-29T15:00:00+02:00',
      end: '2026-09-29T15:30:00+02:00',
      meetingMode: 'GOOGLE_MEET'
    }
  });
  const response = await sendVoiceInteraction(payload);
  assert.equal(response.status, 201);
  const result = await response.json() as { crmStatusAfter: string; appliedChanges: string[] };
  assert.equal(result.crmStatusAfter, 'CALL');
  assert.equal(result.appliedChanges.includes('calendar_reference_recorded'), true);

  const { db } = await import('./db/memory');
  const stored = db.voiceInteractions.find(item => item.eventId === payload.eventId);
  assert.equal(stored?.calendarEventId, 'google-calendar-test-event');
  assert.equal(stored?.calendarStart, '2026-09-29T13:00:00.000Z');
  assert.equal(stored?.calendarEnd, '2026-09-29T13:30:00.000Z');
  assert.equal(stored?.meetingMode, 'GOOGLE_MEET');
  assert.equal(['OFFER', 'FOLLOW-UP', 'WON'].includes(result.crmStatusAfter), false);
});

test('SEND_INFORMATION records facts without inventing OFFER', async () => {
  const lead = await createLead('Information Request GmbH');
  const payload = voicePayload(lead.id, {
    interaction: { channel: 'phone/cold call', direction: 'out', summary: 'Kunde bat um weitere Informationen.', outcome: 'SEND_INFORMATION_REQUESTED' },
    nextAction: { type: 'SEND_INFORMATION', confirmed: true }
  });
  const response = await sendVoiceInteraction(payload);
  assert.equal(response.status, 201);
  const result = await response.json() as { crmStatusAfter: string };
  assert.equal(result.crmStatusAfter, 'NEW');
  const detail = await getLeadDetail(lead.id);
  assert.equal(detail.messages.length, 1);
  const { db } = await import('./db/memory');
  assert.equal(db.voiceInteractions.filter(item => item.leadId === lead.id).length, 1);
});

test('ordinary voice facts preserve WON and LOST terminal statuses', async () => {
  const wonLead = await createLead('Won Terminal GmbH', 'WON', {
    lastContactDate: '2026-09-20', offerAmount: 1200, notes: 'Website project won; onboarding agreed.'
  });
  const wonPayload = voicePayload(wonLead.id, {
    interaction: { channel: 'phone/cold call', direction: 'out', summary: 'Routine call after winning the project.', outcome: 'CALL_COMPLETED' },
    nextAction: { type: 'MEETING', confirmed: true }
  });
  assert.equal((await sendVoiceInteraction(wonPayload)).status, 201);
  assert.equal((await getLeadDetail(wonLead.id)).crmStatus, 'WON');

  const lostLead = await createLead('Lost Terminal GmbH', 'LOST', { lostReason: 'kein Budget' });
  const lostPayload = voicePayload(lostLead.id, {
    interaction: { channel: 'phone/cold call', direction: 'out', summary: 'A meeting fact arrived after the lead was closed.', outcome: 'MEETING_BOOKED' },
    nextAction: { type: 'MEETING', confirmed: true },
    calendar: { confirmed: true, eventId: 'terminal-event', start: '2026-09-29T15:00:00+02:00', end: '2026-09-29T15:30:00+02:00', meetingMode: 'GOOGLE_MEET' }
  });
  assert.equal((await sendVoiceInteraction(lostPayload)).status, 201);
  assert.equal((await getLeadDetail(lostLead.id)).crmStatus, 'LOST');
});
