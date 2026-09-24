export const CRM_STATUSES = ['NEW', 'AUDITED', 'CONTACTED', 'REPLY', 'CALL', 'OFFER', 'FOLLOW-UP', 'WON', 'LOST'] as const;
export type CrmStatus = typeof CRM_STATUSES[number];
export const CONTACT_CHANNELS = ['email', 'contact form', 'LinkedIn', 'WhatsApp', 'phone/cold call'] as const;
export const LOST_REASONS = ['kein Bedarf', 'kein Budget', 'keine Antwort nach Follow-ups', 'eigene Agentur / interner Entwickler', 'Konzern / keine lokale Entscheidungsbefugnis', 'Geschäft nicht mehr aktiv', 'falsche Zielgruppe', 'sonstiger Grund'] as const;
export type ContactChannel = typeof CONTACT_CHANNELS[number];
export type LostReason = typeof LOST_REASONS[number];

export type StatusEvent = {
  status: CrmStatus;
  occurredAt: string;
  summary?: string;
  contactChannel?: ContactChannel;
  offerAmount?: number;
  lostReason?: LostReason;
};

export type Client = {
  id: string;
  company: string;
  branche?: string;
  ort?: string;
  website?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  crmStatus: CrmStatus;
  auditProblem?: string;
  proposedSolution?: string;
  contactChannel?: ContactChannel;
  lastContactDate?: string;
  nextFollowUpDate?: string;
  offerAmount?: number;
  lostReason?: LostReason;
  notes?: string;
  statusHistory: StatusEvent[];
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
};

export type Message = { id: string; clientId: string; channel: ContactChannel; direction: 'in' | 'out'; body: string; createdAt: string };

export type CallTaskStatus = 'DRAFT' | 'READY' | 'DIALING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
export type CallTask = {
  id: string;
  leadId: string;
  status: CallTaskStatus;
  callObjective: string;
  offerFocus?: string;
  operatorNote?: string;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
  attemptCount: number;
  lastFailureReason?: string;
  result?: { outcome?: string; summary?: string; nextAction?: string; interactionId?: string; calendarEventId?: string };
  readinessIssues: Array<'missing_phone' | 'unusable_phone' | 'missing_call_objective' | 'lead_not_found'>;
};

export type CallBrief = {
  leadId: string;
  company: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  website?: string;
  branche?: string;
  ort?: string;
  auditProblem?: string;
  proposedSolution?: string;
  callObjective: string;
  offerFocus?: string;
  operatorNote?: string;
};
