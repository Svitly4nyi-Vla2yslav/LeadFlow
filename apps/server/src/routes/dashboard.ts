import { Router } from 'express';
import { CRM_STATUSES, CrmStatus, db } from '../db/memory';

const r = Router();
const conversionPairs: Array<[CrmStatus, CrmStatus]> = [
  ['AUDITED', 'CONTACTED'],
  ['CONTACTED', 'REPLY'],
  ['REPLY', 'CALL'],
  ['CALL', 'OFFER'],
  ['OFFER', 'WON']
];

r.get('/', (_req, res) => {
  const counts = Object.fromEntries(CRM_STATUSES.map(status => [status, db.clients.filter(c => c.crmStatus === status).length]));
  const reached = (status: CrmStatus) => db.clients.filter(c => c.statusHistory?.some(event => event.status === status)).length;
  const conversions = Object.fromEntries(conversionPairs.map(([from, to]) => {
    const denominator = reached(from);
    const numerator = db.clients.filter(c => c.statusHistory?.some(event => event.status === from) && c.statusHistory?.some(event => event.status === to)).length;
    return [`${from}_TO_${to}`, { numerator, denominator, rate: denominator ? numerator / denominator : null }];
  }));
  const today = new Date().toISOString().slice(0, 10);
  const overdueFollowUps = db.clients.filter(c => c.nextFollowUpDate && c.nextFollowUpDate < today && !['WON', 'LOST'].includes(c.crmStatus)).length;
  const offerPipelineValue = db.clients.filter(c => ['OFFER', 'FOLLOW-UP'].includes(c.crmStatus)).reduce((sum, c) => sum + (c.offerAmount || 0), 0);
  const wonValue = db.clients.filter(c => c.crmStatus === 'WON').reduce((sum, c) => sum + (c.offerAmount || 0), 0);
  res.json({ counts, conversions, total: db.clients.length, overdueFollowUps, offerPipelineValue, wonValue });
});

export default r;
