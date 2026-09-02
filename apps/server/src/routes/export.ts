import { Router } from 'express';
import { db } from '../db/memory';

const r = Router();
const csvValue = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;

r.get('/clients.csv', (_req, res) => {
  const rows = [
    ['Lead ID', 'Company', 'Branche', 'Ort', 'Website', 'Contact Person', 'Phone', 'Email', 'CRM Status', 'Audit Problem', 'Proposed Solution', 'Contact Channel', 'Last Contact Date', 'Next Follow-up Date', 'Offer Amount', 'Lost Reason', 'Notes'],
    ...db.clients.map(c => [
      c.id, c.company, c.branche, c.ort, c.website, c.contactPerson, c.phone, c.email,
      c.crmStatus, c.auditProblem, c.proposedSolution, c.contactChannel, c.lastContactDate,
      c.nextFollowUpDate, c.offerAmount, c.lostReason, (c.notes || '').replace(/\n/g, ' ').trim()
    ])
  ];
  const csv = rows.map(row => row.map(csvValue).join(',')).join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
  res.send(csv);
});

export default r;
