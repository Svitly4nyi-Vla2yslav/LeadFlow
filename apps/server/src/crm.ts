import {
  CONTACT_CHANNELS,
  CRM_STATUSES,
  LOST_REASONS,
  Client,
  ContactChannel,
  CrmStatus,
  LostReason
} from './db/memory';

export type ClientDraft = Omit<Client, 'id' | 'statusHistory' | 'createdAt' | 'updatedAt'>;

const text = (value: unknown) => typeof value === 'string' ? value.trim() : '';
const optionalText = (value: unknown) => text(value) || undefined;
const isDate = (value?: string) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));

export const sanitizeClient = (input: Record<string, unknown>, current?: Client): ClientDraft => {
  const source = current ? { ...current, ...input } : input;
  const amount = source.offerAmount === '' || source.offerAmount === null || source.offerAmount === undefined
    ? undefined
    : Number(source.offerAmount);
  return {
    company: text(source.company || source.name),
    branche: optionalText(source.branche),
    ort: optionalText(source.ort),
    website: optionalText(source.website),
    contactPerson: optionalText(source.contactPerson),
    phone: optionalText(source.phone),
    email: optionalText(source.email),
    crmStatus: (source.crmStatus || 'NEW') as CrmStatus,
    auditProblem: optionalText(source.auditProblem),
    proposedSolution: optionalText(source.proposedSolution),
    contactChannel: optionalText(source.contactChannel) as ContactChannel | undefined,
    lastContactDate: optionalText(source.lastContactDate),
    nextFollowUpDate: optionalText(source.nextFollowUpDate),
    offerAmount: amount,
    lostReason: optionalText(source.lostReason) as LostReason | undefined,
    notes: optionalText(source.notes)
  };
};

export const validateClient = (lead: ClientDraft): string | null => {
  if (!lead.company) return 'Company is required';
  if (!CRM_STATUSES.includes(lead.crmStatus)) return 'Invalid CRM Status';
  if (lead.contactChannel && !CONTACT_CHANNELS.includes(lead.contactChannel)) return 'Invalid Contact Channel';
  if (lead.lostReason && !LOST_REASONS.includes(lead.lostReason)) return 'Invalid Lost Reason';
  if (!isDate(lead.lastContactDate)) return 'Last Contact Date must use YYYY-MM-DD';
  if (!isDate(lead.nextFollowUpDate)) return 'Next Follow-up Date must use YYYY-MM-DD';
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return 'Email is invalid';
  if (lead.offerAmount !== undefined && (!Number.isFinite(lead.offerAmount) || lead.offerAmount < 0)) return 'Offer Amount must be a non-negative number';

  switch (lead.crmStatus) {
    case 'AUDITED':
      if (!lead.auditProblem) return 'AUDITED requires a concrete, confirmed Audit Problem';
      break;
    case 'CONTACTED':
      if (!lead.contactChannel || !lead.lastContactDate || !lead.notes) return 'CONTACTED requires Contact Channel, Last Contact Date and a short contact summary in Notes';
      break;
    case 'REPLY':
      if (!lead.lastContactDate || !lead.notes) return 'REPLY requires Last Contact Date and a meaningful human reply summary in Notes';
      break;
    case 'CALL':
      if (!lead.lastContactDate || !lead.notes) return 'CALL requires date, result, client need and next action in Notes';
      break;
    case 'OFFER':
      if (!lead.offerAmount || !lead.notes) return 'OFFER requires a positive Offer Amount and scope/package/delivery time in Notes';
      break;
    case 'FOLLOW-UP':
      if (!lead.nextFollowUpDate || !lead.lastContactDate || !lead.notes) return 'FOLLOW-UP requires Next Follow-up Date, Last Contact Date and reason in Notes';
      break;
    case 'WON':
      if (!lead.lastContactDate || !lead.offerAmount || !lead.notes) return 'WON requires date, positive amount, service and next stage in Notes';
      break;
    case 'LOST':
      if (!lead.lostReason) return 'LOST requires an approved Lost Reason';
      break;
  }
  return null;
};

export const canonicalImportRow = (row: Record<string, unknown>) => ({
  company: row.company ?? row.Company,
  branche: row.branche ?? row.Branche,
  ort: row.ort ?? row.Ort,
  website: row.website ?? row.Website,
  contactPerson: row.contactPerson ?? row['Contact Person'],
  phone: row.phone ?? row.Phone,
  email: row.email ?? row.Email,
  crmStatus: row.crmStatus ?? row['CRM Status'] ?? 'NEW',
  auditProblem: row.auditProblem ?? row['Audit Problem'],
  proposedSolution: row.proposedSolution ?? row['Proposed Solution'],
  contactChannel: row.contactChannel ?? row['Contact Channel'],
  lastContactDate: row.lastContactDate ?? row['Last Contact Date'],
  nextFollowUpDate: row.nextFollowUpDate ?? row['Next Follow-up Date'],
  offerAmount: row.offerAmount ?? row['Offer Amount'],
  lostReason: row.lostReason ?? row['Lost Reason'],
  notes: row.notes ?? row.Notes
});
