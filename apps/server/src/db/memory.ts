import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

export const CRM_STATUSES = [
  'NEW', 'AUDITED', 'CONTACTED', 'REPLY', 'CALL',
  'OFFER', 'FOLLOW-UP', 'WON', 'LOST'
] as const;

export const CONTACT_CHANNELS = ['email', 'contact form', 'LinkedIn', 'WhatsApp', 'phone/cold call'] as const;

export const LOST_REASONS = [
  'kein Bedarf',
  'kein Budget',
  'keine Antwort nach Follow-ups',
  'eigene Agentur / interner Entwickler',
  'Konzern / keine lokale Entscheidungsbefugnis',
  'Geschäft nicht mehr aktiv',
  'falsche Zielgruppe',
  'sonstiger Grund'
] as const;

export type CrmStatus = typeof CRM_STATUSES[number];
export type LostReason = typeof LOST_REASONS[number];
export type ContactChannel = typeof CONTACT_CHANNELS[number];

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
};

export type Message = {
  id: string;
  clientId: string;
  channel: ContactChannel;
  direction: 'in' | 'out';
  body: string;
  createdAt: string;
};

type Database = { clients: Client[]; messages: Message[] };

const dataFile = resolve(process.env.LEADFLOW_DATA_FILE || 'data/leadflow.json');
const emptyDatabase = (): Database => ({ clients: [], messages: [] });

const loadDatabase = (): Database => {
  if (!existsSync(dataFile)) return emptyDatabase();
  try {
    const parsed = JSON.parse(readFileSync(dataFile, 'utf8')) as Partial<Database>;
    const now = new Date().toISOString();
    return {
      clients: Array.isArray(parsed.clients) ? parsed.clients.map(client => ({
        ...client,
        statusHistory: Array.isArray(client.statusHistory) ? client.statusHistory : [{ status: client.crmStatus || 'NEW', occurredAt: now }],
        createdAt: client.createdAt || now,
        updatedAt: client.updatedAt || client.createdAt || now
      })) as Client[] : [],
      messages: Array.isArray(parsed.messages) ? parsed.messages : []
    };
  } catch (error) {
    console.error(`Could not read LeadFlow data file ${dataFile}:`, error);
    return emptyDatabase();
  }
};

export const db = loadDatabase();

export const persistDb = () => {
  if (process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME) return;
  mkdirSync(dirname(dataFile), { recursive: true });
  const temporaryFile = `${dataFile}.tmp`;
  writeFileSync(temporaryFile, JSON.stringify(db, null, 2), 'utf8');
  renameSync(temporaryFile, dataFile);
};

const normalized = (value?: string) => (value || '').trim().toLocaleLowerCase('de-DE');

export const findClient = (company?: string, website?: string) => {
  const name = normalized(company);
  const url = normalized(website).replace(/\/$/, '');
  return db.clients.find(client => {
    const sameCompany = normalized(client.company) === name;
    const existingUrl = normalized(client.website).replace(/\/$/, '');
    return sameCompany && (!url || !existingUrl || existingUrl === url);
  });
};

export const addClient = (data: Omit<Client, 'id' | 'statusHistory' | 'createdAt' | 'updatedAt'>) => {
  const duplicate = findClient(data.company, data.website);
  if (duplicate) return { item: duplicate, created: false };
  const now = new Date().toISOString();
  const item: Client = {
    id: randomUUID(),
    ...data,
    statusHistory: [{ status: data.crmStatus, occurredAt: now, summary: data.notes }],
    createdAt: now,
    updatedAt: now
  };
  db.clients.push(item);
  persistDb();
  return { item, created: true };
};

export const updateClient = (item: Client, next: Client) => {
  Object.assign(item, next, { updatedAt: new Date().toISOString() });
  persistDb();
  return item;
};

export const addMessage = (data: Omit<Message, 'id' | 'createdAt'>) => {
  const item: Message = { id: randomUUID(), createdAt: new Date().toISOString(), ...data };
  db.messages.push(item);
  persistDb();
  return item;
};

export const removeClient = (id: string) => {
  const index = db.clients.findIndex(client => client.id === id);
  if (index < 0) return false;
  db.clients.splice(index, 1);
  db.messages = db.messages.filter(message => message.clientId !== id);
  persistDb();
  return true;
};

export const storageInfo = { dataFile };
