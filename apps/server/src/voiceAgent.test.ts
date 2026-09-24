import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import type { Client, CrmStatus, LostReason } from './db/memory';
import { applyVoiceInteractionToLead, VoiceAgentInteractionV1Schema, type VoiceAgentInteractionV1 } from './voiceAgent';

const lead = (crmStatus: CrmStatus, extra: Partial<Client> = {}): Client => ({
  id: `lead-${crmStatus}`,
  company: 'Domain Test GmbH',
  crmStatus,
  statusHistory: [{ status: crmStatus, occurredAt: '2026-09-01T00:00:00Z' }],
  createdAt: '2026-09-01T00:00:00Z',
  updatedAt: '2026-09-01T00:00:00Z',
  ...(crmStatus === 'AUDITED' ? { auditProblem: 'Confirmed mobile layout defect.' } : {}),
  ...(crmStatus === 'CONTACTED' ? { contactChannel: 'email' as const, lastContactDate: '2026-09-01', notes: 'Email sent.' } : {}),
  ...(crmStatus === 'REPLY' ? { lastContactDate: '2026-09-01', notes: 'Human reply received.' } : {}),
  ...(crmStatus === 'CALL' ? { lastContactDate: '2026-09-01', notes: 'Call, need and next action confirmed.' } : {}),
  ...(crmStatus === 'OFFER' ? { offerAmount: 500, notes: 'Starter package, delivery in ten days.' } : {}),
  ...(crmStatus === 'FOLLOW-UP' ? { nextFollowUpDate: '2026-09-30', lastContactDate: '2026-09-01', notes: 'Follow-up agreed.' } : {}),
  ...(crmStatus === 'WON' ? { offerAmount: 500, lastContactDate: '2026-09-01', notes: 'Service agreed; onboarding next.' } : {}),
  ...(crmStatus === 'LOST' ? { lostReason: 'kein Budget' as const } : {}),
  ...extra
});

const event = (outcome: VoiceAgentInteractionV1['interaction']['outcome'], extra: Partial<VoiceAgentInteractionV1> = {}): VoiceAgentInteractionV1 => ({
  contractVersion: '1.0',
  eventId: '8e2e70e2-bf82-4d65-a5ce-0c0b9e5e94e1',
  source: 'vs-ai-voice-agent',
  leadRef: { leadId: 'lead-NEW' },
  occurredAt: '2026-09-22T10:00:00Z',
  interaction: { channel: 'phone/cold call', direction: 'out', summary: 'Confirmed interaction summary and client need.', outcome },
  ...extra
});

test('NO_ANSWER advances only early leads to CONTACTED', () => {
  assert.equal(applyVoiceInteractionToLead(lead('NEW'), event('NO_ANSWER')).statusAfter, 'CONTACTED');
  assert.equal(applyVoiceInteractionToLead(lead('AUDITED'), event('NO_ANSWER')).statusAfter, 'CONTACTED');
  for (const status of ['CALL', 'OFFER', 'FOLLOW-UP', 'WON', 'LOST'] as CrmStatus[]) {
    assert.equal(applyVoiceInteractionToLead(lead(status), event('NO_ANSWER')).statusAfter, status);
  }
});

test('CALL_COMPLETED requires confirmed next-action evidence to establish CALL', () => {
  assert.equal(applyVoiceInteractionToLead(lead('NEW'), event('CALL_COMPLETED')).statusAfter, 'NEW');
  const confirmed = event('CALL_COMPLETED', { nextAction: { type: 'NONE', confirmed: true, note: 'No further action requested.' } });
  assert.equal(applyVoiceInteractionToLead(lead('NEW'), confirmed).statusAfter, 'CALL');
});

test('callback only establishes FOLLOW-UP with a confirmed real date', () => {
  const unconfirmed = event('CALLBACK_REQUESTED', { followUp: { requested: true, confirmed: false } });
  assert.equal(applyVoiceInteractionToLead(lead('CALL'), unconfirmed).statusAfter, 'CALL');
  const confirmed = event('CALLBACK_REQUESTED', { followUp: { requested: true, confirmed: true, date: '2026-09-29' } });
  const applied = applyVoiceInteractionToLead(lead('CALL'), confirmed);
  assert.equal(applied.statusAfter, 'FOLLOW-UP');
  assert.equal(applied.next.nextFollowUpDate, '2026-09-29');
});

test('information and handoff facts never invent OFFER or later stages', () => {
  assert.equal(applyVoiceInteractionToLead(lead('CALL'), event('SEND_INFORMATION_REQUESTED')).statusAfter, 'CALL');
  assert.equal(applyVoiceInteractionToLead(lead('REPLY'), event('HUMAN_HANDOFF_REQUESTED')).statusAfter, 'REPLY');
});

test('negative outcomes require an approved supplied lost reason and protect terminal leads', () => {
  assert.equal(applyVoiceInteractionToLead(lead('CALL'), event('NOT_INTERESTED')).statusAfter, 'CALL');
  const rejected = event('NOT_INTERESTED', { lostReason: 'kein Bedarf' as LostReason });
  assert.equal(applyVoiceInteractionToLead(lead('CALL'), rejected).statusAfter, 'LOST');
  assert.equal(applyVoiceInteractionToLead(lead('WON'), rejected).statusAfter, 'WON');
  assert.equal(applyVoiceInteractionToLead(lead('LOST'), event('CALL_COMPLETED', { nextAction: { type: 'NONE', confirmed: true } })).statusAfter, 'LOST');
});

test('strict contract rejects nested extras, malformed dates and incomplete confirmations', () => {
  const base = event('NO_ANSWER');
  assert.equal(VoiceAgentInteractionV1Schema.safeParse({ ...base, leadRef: { leadId: 'x', company: 'Forbidden' } }).success, false);
  assert.equal(VoiceAgentInteractionV1Schema.safeParse({ ...base, occurredAt: '2026-99-99' }).success, false);
  assert.equal(VoiceAgentInteractionV1Schema.safeParse({ ...base, followUp: { requested: true, confirmed: true, date: '2026-02-30' } }).success, false);
  assert.equal(VoiceAgentInteractionV1Schema.safeParse(event('MEETING_BOOKED', { calendar: { confirmed: true, eventId: 'x' } })).success, false);
});

test('Netlify persistence recognizes integration writes and includes voiceInteractions', () => {
  const source = readFileSync(new URL('../../../netlify/functions/api.ts', import.meta.url), 'utf8');
  const snapshotSource = readFileSync(new URL('./databaseSnapshot.ts', import.meta.url), 'utf8');
  assert.match(snapshotSource, /integrations\\\/voice-agent\\\/interactions/);
  assert.match(snapshotSource, /target\.voiceInteractions\.splice/);
  assert.match(snapshotSource, /voiceInteractions: source\.voiceInteractions/);
  assert.match(source, /if \(!isDatabaseMutation\(event\) \|\| response\.statusCode >= 500\) return response/);
  assert.match(source, /store\.setJSON\(DATABASE_KEY, snapshot/);
  assert.match(source, /onlyIfMatch: entry\.etag/);
});
