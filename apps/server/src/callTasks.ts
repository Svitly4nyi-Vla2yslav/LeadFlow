import { CallTask, CallTaskStatus, Client } from './db/memory';

export type ReadinessIssue = 'missing_phone' | 'unusable_phone' | 'missing_call_objective';
export type PhoneUsability = 'missing' | 'clearly_unusable' | 'potentially_usable';

const TRANSITIONS: Record<CallTaskStatus, readonly CallTaskStatus[]> = {
  DRAFT: ['READY'],
  READY: ['CANCELLED', 'FAILED', 'DIALING'],
  DIALING: ['IN_PROGRESS', 'FAILED'],
  IN_PROGRESS: ['COMPLETED', 'FAILED'],
  COMPLETED: [],
  FAILED: [],
  CANCELLED: []
};

export const phoneUsability = (phone?: string): PhoneUsability => {
  const value = phone?.trim() || '';
  if (!value) return 'missing';
  if (!/^[+\d\s()./-]+$/.test(value)) return 'clearly_unusable';
  return (value.match(/\d/g) || []).length >= 5 ? 'potentially_usable' : 'clearly_unusable';
};

export const callTaskReadiness = (lead: Client, callTask: Pick<CallTask, 'callObjective'>): ReadinessIssue[] => {
  const issues: ReadinessIssue[] = [];
  const phone = phoneUsability(lead.phone);
  if (phone === 'missing') issues.push('missing_phone');
  if (phone === 'clearly_unusable') issues.push('unusable_phone');
  if (!callTask.callObjective.trim()) issues.push('missing_call_objective');
  return issues;
};

export const canTransitionCallTask = (from: CallTaskStatus, to: CallTaskStatus) => TRANSITIONS[from].includes(to);

export const transitionCallTask = (task: CallTask, to: CallTaskStatus, now = new Date().toISOString()): CallTask => {
  if (!canTransitionCallTask(task.status, to)) throw new Error(`invalid_transition:${task.status}:${to}`);
  return {
    ...task,
    status: to,
    updatedAt: now,
    ...(to === 'DIALING' ? { startedAt: now, attemptCount: task.attemptCount + 1 } : {}),
    ...(to === 'COMPLETED' ? { completedAt: now } : {})
  };
};

export const buildCallBrief = (lead: Client, callTask: CallTask) => ({
  leadId: lead.id,
  company: lead.company,
  ...(lead.contactPerson ? { contactPerson: lead.contactPerson } : {}),
  ...(lead.phone ? { phone: lead.phone } : {}),
  ...(lead.email ? { email: lead.email } : {}),
  ...(lead.website ? { website: lead.website } : {}),
  ...(lead.branche ? { branche: lead.branche } : {}),
  ...(lead.ort ? { ort: lead.ort } : {}),
  ...(lead.preferredLanguage ? { preferredLanguage: lead.preferredLanguage } : {}),
  ...(lead.decisionMaker ? { decisionMaker: lead.decisionMaker } : {}),
  ...(lead.currentSituation ? { currentSituation: lead.currentSituation } : {}),
  ...(lead.painPoints ? { painPoints: lead.painPoints } : {}),
  ...(lead.auditProblem ? { auditProblem: lead.auditProblem } : {}),
  ...(lead.proposedSolution ? { proposedSolution: lead.proposedSolution } : {}),
  ...(lead.emmaFocus ? { emmaFocus: lead.emmaFocus } : {}),
  ...(lead.doNotMention ? { doNotMention: lead.doNotMention } : {}),
  callObjective: callTask.callObjective,
  ...(callTask.offerFocus || lead.offerFocus ? { offerFocus: callTask.offerFocus || lead.offerFocus } : {}),
  ...(callTask.operatorNote ? { operatorNote: callTask.operatorNote } : {})
});
