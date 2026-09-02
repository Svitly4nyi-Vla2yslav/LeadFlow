import { Router } from 'express';
import { CONTACT_CHANNELS, ContactChannel, addMessage, db } from '../db/memory';

const router = Router();

router.get('/', (req, res) => {
  const clientId = String(req.query.clientId || '');
  const list = (clientId ? db.messages.filter(message => message.clientId === clientId) : db.messages)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  res.json(list);
});

router.post('/', (req, res) => {
  const clientId = String(req.body?.clientId || '');
  const channel = String(req.body?.channel || '') as ContactChannel;
  const direction = String(req.body?.direction || '');
  const body = String(req.body?.body || '').trim();
  if (!db.clients.some(client => client.id === clientId)) return res.status(404).json({ error: 'Lead not found' });
  if (!CONTACT_CHANNELS.includes(channel)) return res.status(400).json({ error: 'Invalid Contact Channel' });
  if (!['in', 'out'].includes(direction)) return res.status(400).json({ error: 'Direction must be in or out' });
  if (!body) return res.status(400).json({ error: 'Message summary is required' });
  const item = addMessage({ clientId, channel, direction: direction as 'in' | 'out', body });
  res.status(201).json(item);
});

export default router;
