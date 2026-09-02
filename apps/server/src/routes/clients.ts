import { Router } from 'express';
import {
  CONTACT_CHANNELS,
  CRM_STATUSES,
  LOST_REASONS,
  Client,
  CrmStatus,
  addClient,
  db,
  removeClient,
  updateClient
} from '../db/memory';
import { canonicalImportRow, sanitizeClient, validateClient } from '../crm';

const router = Router();

router.get('/meta', (_req, res) => res.json({ statuses: CRM_STATUSES, contactChannels: CONTACT_CHANNELS, lostReasons: LOST_REASONS }));

router.get('/', (req, res) => {
  const query = String(req.query.q || '').trim().toLocaleLowerCase('de-DE');
  const status = String(req.query.status || '').trim();
  const followUp = String(req.query.followUp || '').trim();
  const today = new Date().toISOString().slice(0, 10);
  const filtered = db.clients.filter(client => {
    if (status && client.crmStatus !== status) return false;
    if (followUp === 'overdue' && (!client.nextFollowUpDate || client.nextFollowUpDate >= today || ['WON', 'LOST'].includes(client.crmStatus))) return false;
    if (!query) return true;
    return [client.company, client.branche, client.ort, client.website, client.contactPerson, client.email, client.phone]
      .some(value => value?.toLocaleLowerCase('de-DE').includes(query));
  }).sort((a, b) => {
    const aDate = a.nextFollowUpDate || '9999-12-31';
    const bDate = b.nextFollowUpDate || '9999-12-31';
    return aDate.localeCompare(bDate) || b.updatedAt.localeCompare(a.updatedAt);
  });
  res.json(filtered);
});

router.post('/import', (req, res) => {
  if (!Array.isArray(req.body?.leads)) return res.status(400).json({ error: 'leads[] is required' });
  if (req.body.leads.length > 1000) return res.status(400).json({ error: 'Maximum import size is 1000 leads' });
  const result = { created: 0, skipped: 0, errors: [] as Array<{ row: number; error: string }> };
  req.body.leads.forEach((row: unknown, index: number) => {
    if (!row || typeof row !== 'object' || Array.isArray(row)) {
      result.errors.push({ row: index + 1, error: 'Row must be an object' });
      return;
    }
    const draft = sanitizeClient(canonicalImportRow(row as Record<string, unknown>));
    const error = validateClient(draft);
    if (error) {
      result.errors.push({ row: index + 1, error });
      return;
    }
    const saved = addClient(draft);
    saved.created ? result.created++ : result.skipped++;
  });
  res.status(result.errors.length ? 207 : 200).json(result);
});

router.post('/', (req, res) => {
  const draft = sanitizeClient(req.body || {});
  const error = validateClient(draft);
  if (error) return res.status(400).json({ error });
  const saved = addClient(draft);
  res.status(saved.created ? 201 : 200).json({ ...saved.item, duplicate: !saved.created });
});

router.get('/:id', (req, res) => {
  const item = db.clients.find(client => client.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Lead not found' });
  const messages = db.messages.filter(message => message.clientId === item.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  res.json({ ...item, messages });
});

router.patch('/:id', (req, res) => {
  const item = db.clients.find(client => client.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Lead not found' });
  const draft = sanitizeClient(req.body || {}, item);
  const error = validateClient(draft);
  if (error) return res.status(400).json({ error });
  const statusHistory = item.statusHistory || [];
  if (draft.crmStatus !== item.crmStatus) {
    statusHistory.push({
      status: draft.crmStatus,
      occurredAt: new Date().toISOString(),
      summary: draft.notes,
      contactChannel: draft.contactChannel,
      offerAmount: draft.offerAmount,
      lostReason: draft.lostReason
    });
  }
  const next: Client = { ...item, ...draft, statusHistory };
  res.json(updateClient(item, next));
});

router.delete('/:id', (req, res) => {
  if (req.query.confirm !== 'DELETE') return res.status(400).json({ error: 'Add ?confirm=DELETE to remove this lead and its messages' });
  if (!removeClient(req.params.id)) return res.status(404).json({ error: 'Lead not found' });
  res.status(204).send();
});

export default router;
