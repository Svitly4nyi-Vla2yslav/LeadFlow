import { createHash } from 'node:crypto';
import { z } from 'zod';
import { LOST_REASONS, type Client, type CrmStatus } from './db/memory';
import { sanitizeClient, validateClient } from './crm';

const isoTimestamp = z.string().datetime({ offset: true }).transform(value => new Date(value).toISOString());
const dateOnly = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}, 'Invalid calendar date');
const boundedText = (maximum: number) => z.string().trim().min(1).max(maximum);

const nextActionSchema = z.object({
  type: z.enum(['NONE', 'CALLBACK', 'FOLLOW_UP', 'MEETING', 'SEND_INFORMATION', 'HUMAN_HANDOFF']),
  confirmed: z.boolean(),
  dueAt: isoTimestamp.optional(),
  note: boundedText(1000).optional()
}).strict();

const followUpSchema = z.object({
  requested: z.boolean(),
  confirmed: z.boolean(),
  date: dateOnly.optional(),
  dueAt: isoTimestamp.optional(),
  timeWindow: boundedText(200).optional(),
  reason: boundedText(1000).optional()
}).strict();

const calendarSchema = z.object({
  confirmed: z.boolean(),
  eventId: boundedText(500).optional(),
  start: isoTimestamp.optional(),
  end: isoTimestamp.optional(),
  meetingMode: z.enum(['GOOGLE_MEET', 'PHONE', 'IN_PERSON']).optional()
}).strict();

export const VoiceAgentInteractionV1Schema = z.object({
  contractVersion: z.literal('1.0'),
  eventId: z.string().uuid().transform(value => value.toLowerCase()),
  source: z.literal('vs-ai-voice-agent'),
  leadRef: z.object({ leadId: boundedText(200) }).strict(),
  occurredAt: isoTimestamp,
  interaction: z.object({
    channel: z.literal('phone/cold call'),
    direction: z.literal('out'),
    summary: boundedText(2000),
    outcome: z.enum([
      'NO_ANSWER', 'CALL_COMPLETED', 'CALLBACK_REQUESTED', 'MEETING_BOOKED',
      'SEND_INFORMATION_REQUESTED', 'HUMAN_HANDOFF_REQUESTED', 'NOT_INTERESTED', 'DO_NOT_CONTACT'
    ])
  }).strict(),
  nextAction: nextActionSchema.optional(),
  followUp: followUpSchema.optional(),
  calendar: calendarSchema.optional(),
  lostReason: z.enum(LOST_REASONS).optional()
}).strict().superRefine((value, context) => {
  if (value.calendar?.confirmed && (!value.calendar.eventId || !value.calendar.start || !value.calendar.end)) {
    context.addIssue({ code: 'custom', path: ['calendar'], message: 'Confirmed calendar requires eventId, start and end' });
  }
  if (value.calendar?.start && value.calendar?.end && Date.parse(value.calendar.end) <= Date.parse(value.calendar.start)) {
    context.addIssue({ code: 'custom', path: ['calendar', 'end'], message: 'Calendar end must be after start' });
  }
  if (value.interaction.outcome === 'MEETING_BOOKED' && value.calendar?.confirmed !== true) {
    context.addIssue({ code: 'custom', path: ['calendar'], message: 'MEETING_BOOKED requires confirmed calendar data' });
  }
  if (value.calendar?.confirmed && value.interaction.outcome !== 'MEETING_BOOKED') {
    context.addIssue({ code: 'custom', path: ['calendar'], message: 'Confirmed calendar data is only valid for MEETING_BOOKED' });
  }
  if (value.followUp?.confirmed && (!value.followUp.requested || (!value.followUp.date && !value.followUp.dueAt))) {
    context.addIssue({ code: 'custom', path: ['followUp'], message: 'Confirmed follow-up requires requested=true and a date or dueAt' });
  }
  if (value.lostReason && !['NOT_INTERESTED', 'DO_NOT_CONTACT'].includes(value.interaction.outcome)) {
    context.addIssue({ code: 'custom', path: ['lostReason'], message: 'lostReason is only valid for a confirmed negative outcome' });
  }
});

export type VoiceAgentInteractionV1 = z.infer<typeof VoiceAgentInteractionV1Schema>;

export const voicePayloadHash = (payload: VoiceAgentInteractionV1) =>
  createHash('sha256').update(JSON.stringify(payload)).digest('hex');

const earlyForContact = new Set<CrmStatus>(['NEW', 'AUDITED']);
const earlyForCall = new Set<CrmStatus>(['NEW', 'AUDITED', 'CONTACTED', 'REPLY']);
const activeForFollowUp = new Set<CrmStatus>(['NEW', 'AUDITED', 'CONTACTED', 'REPLY', 'CALL', 'OFFER']);
const terminal = new Set<CrmStatus>(['WON', 'LOST']);

export type VoiceLeadApplication = {
  next: Client;
  statusBefore: CrmStatus;
  statusAfter: CrmStatus;
  appliedChanges: string[];
};

export const applyVoiceInteractionToLead = (lead: Client, event: VoiceAgentInteractionV1): VoiceLeadApplication => {
  const statusBefore = lead.crmStatus;
  let statusAfter = statusBefore;
  const occurredDate = event.occurredAt.slice(0, 10);
  const appliedChanges: string[] = [];
  const changes: Record<string, unknown> = {};

  if (!terminal.has(statusBefore)) {
    changes.contactChannel = 'phone/cold call';
    changes.lastContactDate = occurredDate;
    changes.notes = [lead.notes, event.interaction.summary].filter(Boolean).join('\n\n');
    appliedChanges.push('last_contact_updated');
  }

  switch (event.interaction.outcome) {
    case 'NO_ANSWER':
      if (earlyForContact.has(statusBefore)) statusAfter = 'CONTACTED';
      break;
    case 'CALL_COMPLETED':
      if (earlyForCall.has(statusBefore) && event.nextAction?.confirmed) statusAfter = 'CALL';
      break;
    case 'MEETING_BOOKED':
      if (earlyForCall.has(statusBefore)) statusAfter = 'CALL';
      break;
    case 'CALLBACK_REQUESTED':
      if (activeForFollowUp.has(statusBefore) && event.followUp?.confirmed && (event.followUp.date || event.followUp.dueAt)) {
        changes.nextFollowUpDate = event.followUp.date || event.followUp.dueAt!.slice(0, 10);
        statusAfter = 'FOLLOW-UP';
        appliedChanges.push('follow_up_scheduled');
      }
      break;
    case 'NOT_INTERESTED':
    case 'DO_NOT_CONTACT':
      if (!terminal.has(statusBefore) && event.lostReason) {
        changes.lostReason = event.lostReason;
        statusAfter = 'LOST';
      }
      break;
  }

  changes.crmStatus = statusAfter;
  const draft = sanitizeClient(changes, lead);
  const validationError = validateClient(draft);
  if (validationError) throw new Error(`Voice interaction cannot produce a valid CRM record: ${validationError}`);

  const statusHistory = [...(lead.statusHistory || [])];
  if (statusAfter !== statusBefore) {
    statusHistory.push({
      status: statusAfter,
      occurredAt: event.occurredAt,
      summary: event.interaction.summary,
      contactChannel: 'phone/cold call',
      lostReason: draft.lostReason
    });
    appliedChanges.push('crm_status_changed');
  }

  return {
    next: { ...lead, ...draft, statusHistory },
    statusBefore,
    statusAfter,
    appliedChanges
  };
};
