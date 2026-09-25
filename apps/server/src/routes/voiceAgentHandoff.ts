import { Router } from 'express';
import { db } from '../db/memory';
import { callTaskReadiness } from '../callTasks';
import { getVoiceAgentAppStatus, issueTaskAwareVoiceAgentHandoff, issueVoiceAgentHandoff, voiceAgentHandoffSigningConfigured } from '../voiceAgentHandoff';

const router = Router();

router.get('/status', (_req, res) => {
  const status = getVoiceAgentAppStatus();
  return res.json(status.configured
    ? { configured: true, environment: status.environment, origin: status.origin }
    : { configured: false, environment: status.environment, reason: status.reason });
});

router.post('/handoff', (req, res) => {
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body) || typeof body.leadId !== 'string' || !body.leadId) {
    return res.status(400).json({ error: 'handoff_invalid' });
  }
  const keys = Object.keys(body).sort().join(',');
  const legacy = keys === 'leadId';
  const taskAware = keys === 'callTaskId,leadId' && typeof body.callTaskId === 'string' && body.callTaskId;
  if (!legacy && !taskAware) return res.status(400).json({ error: 'handoff_invalid' });

  const lead = db.clients.find(client => client.id === body.leadId);
  if (!lead) return res.status(404).json({ error: 'lead_not_found' });

  const task = taskAware ? db.callTasks.find(item => item.id === body.callTaskId) : undefined;
  if (taskAware && !task) return res.status(404).json({ error: 'call_task_not_found' });
  if (task && task.leadId !== lead.id) return res.status(409).json({ error: 'call_task_mismatch' });
  if (task && (task.status !== 'READY' || callTaskReadiness(lead, task).length)) {
    return res.status(409).json({ error: 'call_task_not_ready' });
  }

  const appStatus = getVoiceAgentAppStatus();
  if (!appStatus.configured) return res.status(503).json({ error: 'voice_agent_app_not_configured' });
  if (!voiceAgentHandoffSigningConfigured()) return res.status(503).json({ error: 'Voice Agent handoff signing is not configured' });

  return res.json({
    handoffToken: task ? issueTaskAwareVoiceAgentHandoff(lead.id, task.id) : issueVoiceAgentHandoff(lead.id),
    voiceAgentAppUrl: appStatus.origin
  });
});

export default router;
