import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalImportRow, sanitizeClient, validateClient } from './crm';

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

test('new Emma preparation fields are optional, sanitized and language-validated', () => {
  const lead = sanitizeClient({
    company: ' Context GmbH ', source: ' Referral ', preferredLanguage: 'uk', decisionMaker: ' Olena ',
    currentSituation: ' Existing brochure site ', painPoints: ' Slow mobile pages ', emmaFocus: ' Listen for timing ',
    offerFocus: ' Responsive website ', doNotMention: ' Competitor names '
  });
  assert.equal(validateClient(lead), null);
  assert.deepEqual({
    source: lead.source, preferredLanguage: lead.preferredLanguage, decisionMaker: lead.decisionMaker,
    currentSituation: lead.currentSituation, painPoints: lead.painPoints, emmaFocus: lead.emmaFocus,
    offerFocus: lead.offerFocus, doNotMention: lead.doNotMention
  }, {
    source: 'Referral', preferredLanguage: 'uk', decisionMaker: 'Olena', currentSituation: 'Existing brochure site',
    painPoints: 'Slow mobile pages', emmaFocus: 'Listen for timing', offerFocus: 'Responsive website', doNotMention: 'Competitor names'
  });
  assert.match(validateClient(sanitizeClient({ company: 'Bad Language GmbH', preferredLanguage: 'es' })) || '', /Preferred Language/);
});

test('canonical import accepts legacy rows and maps the new canonical columns', () => {
  assert.equal(validateClient(sanitizeClient(canonicalImportRow({ Company: 'Legacy GmbH', Phone: '+49 511 1' }))), null);
  const mapped = sanitizeClient(canonicalImportRow({
    Company: 'Imported Context GmbH', Source: 'CSV', 'Preferred Language': 'de', 'Decision Maker': 'Alex',
    'Current Situation': 'Old site', 'Pain Points': 'No mobile booking', 'Emma Focus': 'Booking need',
    'Offer Focus': 'Relaunch', 'Do Not Mention': 'Pricing floor'
  }));
  assert.equal(mapped.preferredLanguage, 'de');
  assert.equal(mapped.currentSituation, 'Old site');
  assert.equal(mapped.doNotMention, 'Pricing floor');
});
