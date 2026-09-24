import { Router } from 'express';
import { addMessage, addVoiceInteraction, db, persistDb, updateClient } from '../db/memory';
import { applyVoiceInteractionToLead, VoiceAgentInteractionV1Schema, voicePayloadHash } from '../voiceAgent';
import { buildCallBrief, callTaskReadiness } from '../callTasks';
import { verifyVoiceAgentHandoffResult } from '../voiceAgentHandoff';

const router = Router();

router.post('/resolve-handoff', (req, res) => {
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)
    || Object.keys(body).length !== 1 || typeof body.handoffToken !== 'string' || !body.handoffToken) {
    return res.status(400).json({ error: 'invalid_handoff' });
  }

  const verification = verifyVoiceAgentHandoffResult(body.handoffToken);
  if (!verification.handoff) return res.status(401).json({ error: verification.error });
  const handoff = verification.handoff;

  const lead = db.clients.find(client => client.id === handoff.leadId);
  if (!lead) return res.status(404).json({ error: 'lead_not_found' });

  if (handoff.version === '2') {
    const task = db.callTasks.find(item => item.id === handoff.callTaskId);
    if (!task) return res.status(404).json({ error: 'call_task_not_found' });
    if (task.leadId !== lead.id) return res.status(409).json({ error: 'call_task_mismatch' });
    if (task.status !== 'READY' || callTaskReadiness(lead, task).length) {
      return res.status(409).json({ error: 'call_task_not_ready' });
    }
    return res.json({
      ok: true,
      lead: {
        id: lead.id,
        company: lead.company,
        contactPerson: lead.contactPerson ?? null,
        phone: lead.phone ?? null,
        email: lead.email ?? null,
        crmStatus: lead.crmStatus
      },
      callTask: {
        id: task.id,
        status: task.status,
        scheduledAt: task.scheduledAt ?? null
      },
      callBrief: buildCallBrief(lead, task)
    });
  }

  // Legacy v1 stays lead-only and never selects or attaches a CallTask.
  return res.json({
    ok: true,
    lead: {
      id: lead.id,
      company: lead.company,
      contactPerson: lead.contactPerson ?? null,
      phone: lead.phone ?? null,
      email: lead.email ?? null,
      crmStatus: lead.crmStatus
    }
  });
});

router.post('/interactions', (req, res) => {
  const parsed = VoiceAgentInteractionV1Schema.safeParse(req.body);
  if (!parsed.success) {
    console.info('[Voice Integration] rejected');
    return res.status(400).json({ error: 'invalid_payload', issues: parsed.error.issues.map(issue => ({ path: issue.path.join('.'), message: issue.message })) });
  }

  const event = parsed.data;
  const payloadHash = voicePayloadHash(event);
  const existing = db.voiceInteractions.find(interaction => interaction.eventId === event.eventId);
  if (existing) {
    if (existing.payloadHash !== payloadHash) {
      console.info('[Voice Integration] rejected');
      return res.status(409).json({ error: 'event_conflict' });
    }
    console.info('[Voice Integration] duplicate');
    return res.json({
      ok: true,
      duplicate: true,
      interactionId: existing.id,
      leadId: existing.leadId,
      crmStatusBefore: existing.crmStatusBefore,
      crmStatusAfter: existing.crmStatusAfter,
      appliedChanges: []
    });
  }

  const lead = db.clients.find(client => client.id === event.leadRef.leadId);
  if (!lead) {
    console.info('[Voice Integration] rejected');
    return res.status(404).json({ error: 'lead_not_found' });
  }

  let application;
  try {
    application = applyVoiceInteractionToLead(lead, event);
  } catch {
    console.info('[Voice Integration] rejected');
    return res.status(422).json({ error: 'crm_evidence_rejected' });
  }

  addMessage({
    clientId: lead.id,
    channel: 'phone/cold call',
    direction: 'out',
    body: event.interaction.summary
  }, false);
  const interaction = addVoiceInteraction({
    eventId: event.eventId,
    payloadHash,
    leadId: lead.id,
    occurredAt: event.occurredAt,
    summary: event.interaction.summary,
    outcome: event.interaction.outcome,
    nextAction: event.nextAction,
    followUp: event.followUp,
    calendarEventId: event.calendar?.eventId,
    calendarStart: event.calendar?.start,
    calendarEnd: event.calendar?.end,
    meetingMode: event.calendar?.meetingMode,
    lostReason: event.lostReason,
    crmStatusBefore: application.statusBefore,
    crmStatusAfter: application.statusAfter
  }, false);
  updateClient(lead, application.next, false);
  persistDb();

  const appliedChanges = ['message_added', ...application.appliedChanges];
  if (event.calendar?.confirmed) appliedChanges.splice(1, 0, 'calendar_reference_recorded');
  console.info('[Voice Integration] accepted');
  if (application.statusBefore !== application.statusAfter) console.info('[Voice Integration] CRM status changed');
  return res.status(201).json({
    ok: true,
    duplicate: false,
    interactionId: interaction.id,
    leadId: lead.id,
    crmStatusBefore: application.statusBefore,
    crmStatusAfter: application.statusAfter,
    appliedChanges
  });
});

export default router;
