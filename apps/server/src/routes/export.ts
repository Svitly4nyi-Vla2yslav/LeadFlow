import { Router } from 'express';
import { db } from '../db/memory';

const r = Router();

// GET /api/export/clients.csv
r.get('/clients.csv', (_req, res) => {
  const rows = [
    ['id','name','website','email','phone','notes','tags'],
    ...db.clients.map(c => [
      c.id, c.name, c.website||'', c.email||'', c.phone||'', (c.notes||'').replace(/\n/g,' ').trim(), (c.tags||[]).join('|')
    ])
  ];
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  res.setHeader('Content-Type','text/csv; charset=utf-8');
  res.setHeader('Content-Disposition','attachment; filename="clients.csv"');
  res.send(csv);
});

export default r;
