import { Router } from 'express';
import { db } from '../db/memory';
import { getVoiceAgentAppUrl, issueVoiceAgentHandoff, voiceAgentHandoffSigningConfigured } from '../voiceAgentHandoff';

const router = Router();

router.post('/handoff', (req, res) => {
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)
    || Object.keys(body).length !== 1 || typeof body.leadId !== 'string' || !body.leadId) {
    return res.status(400).json({ error: 'leadId is required' });
  }

  const lead = db.clients.find(client => client.id === body.leadId);
  if (!lead) return res.status(404).json({ error: 'lead_not_found' });

  const voiceAgentAppUrl = getVoiceAgentAppUrl();
  if (!voiceAgentAppUrl) return res.status(503).json({ error: 'Voice Agent application URL is not configured' });
  if (!voiceAgentHandoffSigningConfigured()) return res.status(503).json({ error: 'Voice Agent handoff signing is not configured' });

  return res.json({
    handoffToken: issueVoiceAgentHandoff(lead.id),
    voiceAgentAppUrl
  });
});

export default router;
