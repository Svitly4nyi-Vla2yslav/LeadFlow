import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeClient, validateClient } from './crm';

test('NEW only requires a company', () => {
  assert.equal(validateClient(sanitizeClient({ company: 'Beispiel GmbH', crmStatus: 'NEW' })), null);
});

test('AUDITED rejects an assumed issue without a concrete audit point', () => {
  assert.match(validateClient(sanitizeClient({ company: 'Beispiel GmbH', crmStatus: 'AUDITED' })) || '', /Audit Problem/);
  assert.equal(validateClient(sanitizeClient({ company: 'Beispiel GmbH', crmStatus: 'AUDITED', auditProblem: 'Mobile CTA overlaps the footer at 390 px viewport' })), null);
});

test('CONTACTED requires channel, date and summary', () => {
  assert.match(validateClient(sanitizeClient({ company: 'Beispiel GmbH', crmStatus: 'CONTACTED', contactChannel: 'email' })) || '', /Last Contact Date/);
  assert.equal(validateClient(sanitizeClient({ company: 'Beispiel GmbH', crmStatus: 'CONTACTED', contactChannel: 'email', lastContactDate: '2026-09-02', notes: 'Sent a short audit and invitation to talk.' })), null);
});

test('OFFER requires a positive amount and delivery details', () => {
  assert.match(validateClient(sanitizeClient({ company: 'Beispiel GmbH', crmStatus: 'OFFER', offerAmount: 0, notes: 'Starter' })) || '', /positive Offer Amount/);
  assert.equal(validateClient(sanitizeClient({ company: 'Beispiel GmbH', crmStatus: 'OFFER', offerAmount: 480, notes: 'Starter one-pager, delivery in 10 working days.' })), null);
});

test('LOST only accepts the approved reason list', () => {
  assert.match(validateClient(sanitizeClient({ company: 'Beispiel GmbH', crmStatus: 'LOST', lostReason: 'maybe later' })) || '', /Invalid Lost Reason/);
  assert.equal(validateClient(sanitizeClient({ company: 'Beispiel GmbH', crmStatus: 'LOST', lostReason: 'kein Budget' })), null);
});

test('invalid contact data is rejected', () => {
  assert.match(validateClient(sanitizeClient({ company: 'Beispiel GmbH', crmStatus: 'NEW', email: 'not-an-email' })) || '', /Email is invalid/);
  assert.match(validateClient(sanitizeClient({ company: 'Beispiel GmbH', crmStatus: 'NEW', lastContactDate: '02.09.2026' })) || '', /YYYY-MM-DD/);
});
