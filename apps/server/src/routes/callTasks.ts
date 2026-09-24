import { Router } from 'express';
import { buildCallBrief, callTaskReadiness, transitionCallTask } from '../callTasks';
import { CallTask, addCallTask, db, updateCallTask } from '../db/memory';

const router = Router();
const EDITABLE_FIELDS = ['callObjective', 'offerFocus', 'operatorNote', 'scheduledAt'] as const;
const CREATE_FIELDS = ['leadId', ...EDITABLE_FIELDS] as const;

const text = (value: unknown) => typeof value === 'string' ? value.trim() : '';
const optionalText = (value: unknown) => text(value) || undefined;
const hasOnlyFields = (body: Record<string, unknown>, allowed: readonly string[]) => Object.keys(body).every(key => allowed.includes(key));
const validScheduledAt = (value?: string) => !value || !Number.isNaN(Date.parse(value));

const sanitizeFields = (body: Record<string, unknown>) => ({
  callObjective: text(body.callObjective),
  offerFocus: optionalText(body.offerFocus),
  operatorNote: optionalText(body.operatorNote),
  scheduledAt: optionalText(body.scheduledAt)
});

const validateFields = (fields: ReturnType<typeof sanitizeFields>) => {
  if (fields.callObjective.length > 2000) return 'callObjective is too long';
  if ((fields.offerFocus?.length || 0) > 2000) return 'offerFocus is too long';
  if ((fields.operatorNote?.length || 0) > 5000) return 'operatorNote is too long';
  if (!validScheduledAt(fields.scheduledAt)) return 'scheduledAt must be a valid date-time';
  return null;
};

const view = (task: CallTask) => {
  const lead = db.clients.find(item => item.id === task.leadId);
  return { ...task, readinessIssues: lead ? callTaskReadiness(lead, task) : ['lead_not_found'] };
};

router.post('/', (req, res) => {
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) return res.status(400).json({ error: 'Request body must be an object' });
  if (!hasOnlyFields(body, CREATE_FIELDS)) return res.status(400).json({ error: 'Unsupported call task field' });
  const leadId = text(body.leadId);
  if (!leadId) return res.status(400).json({ error: 'leadId is required' });
  const lead = db.clients.find(item => item.id === leadId);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  const fields = sanitizeFields(body);
  const error = validateFields(fields);
  if (error) return res.status(400).json({ error });
  const readinessIssues = callTaskReadiness(lead, fields);
  const task = addCallTask({
    leadId,
    status: readinessIssues.length ? 'DRAFT' : 'READY',
    ...fields,
    attemptCount: 0
  });
  return res.status(201).json(view(task));
});

router.get('/', (req, res) => {
  const leadId = text(req.query.leadId);
  if (leadId && !db.clients.some(item => item.id === leadId)) return res.status(404).json({ error: 'Lead not found' });
  const tasks = (leadId ? db.callTasks.filter(task => task.leadId === leadId) : db.callTasks)
    .slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return res.json(tasks.map(view));
});

router.get('/:id/brief', (req, res) => {
  const task = db.callTasks.find(item => item.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Call task not found' });
  const lead = db.clients.find(item => item.id === task.leadId);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  return res.json(buildCallBrief(lead, task));
});

router.get('/:id', (req, res) => {
  const task = db.callTasks.find(item => item.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Call task not found' });
  if (!db.clients.some(item => item.id === task.leadId)) return res.status(404).json({ error: 'Lead not found' });
  return res.json(view(task));
});

router.patch('/:id', (req, res) => {
  const task = db.callTasks.find(item => item.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Call task not found' });
  const lead = db.clients.find(item => item.id === task.leadId);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) return res.status(400).json({ error: 'Request body must be an object' });
  if (!hasOnlyFields(req.body, EDITABLE_FIELDS)) return res.status(400).json({ error: 'Status and system fields cannot be patched' });
  if (!['DRAFT', 'READY'].includes(task.status)) return res.status(409).json({ error: `Call task cannot be edited in ${task.status}` });

  const fields = sanitizeFields({
    callObjective: task.callObjective,
    offerFocus: task.offerFocus,
    operatorNote: task.operatorNote,
    scheduledAt: task.scheduledAt,
    ...req.body
  });
  const error = validateFields(fields);
  if (error) return res.status(400).json({ error });
  const readinessIssues = callTaskReadiness(lead, fields);
  if (task.status === 'READY' && readinessIssues.length) {
    return res.status(409).json({ error: 'Ready call task requirements cannot be removed', readinessIssues });
  }
  let next: CallTask = { ...task, ...fields };
  if (task.status === 'DRAFT' && !readinessIssues.length) next = transitionCallTask(next, 'READY');
  return res.json(view(updateCallTask(task, next)));
});

router.post('/:id/cancel', (req, res) => {
  const task = db.callTasks.find(item => item.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Call task not found' });
  if (!db.clients.some(item => item.id === task.leadId)) return res.status(404).json({ error: 'Lead not found' });
  try {
    return res.json(view(updateCallTask(task, transitionCallTask(task, 'CANCELLED'))));
  } catch {
    return res.status(409).json({ error: `Cannot transition call task from ${task.status} to CANCELLED` });
  }
});

export default router;
