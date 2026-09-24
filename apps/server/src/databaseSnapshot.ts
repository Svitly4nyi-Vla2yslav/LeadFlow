import { CallTask, Client, Database, Message, VoiceInteraction, db } from './db/memory';

export type StoredDatabase = {
  clients: Client[];
  messages: Message[];
  voiceInteractions?: VoiceInteraction[];
  callTasks?: CallTask[];
};

export type MutationEvent = { httpMethod?: string; path?: string; rawUrl?: string };

export const isDatabaseMutation = (event: MutationEvent) => {
  const method = (event.httpMethod || 'GET').toUpperCase();
  const path = event.path || (event.rawUrl ? new URL(event.rawUrl).pathname : '');
  return !['GET', 'HEAD', 'OPTIONS'].includes(method)
    && /\/api\/(clients|messages|call-tasks|integrations\/voice-agent\/interactions)(\/|$)/.test(path);
};

export const hydrateDatabase = (stored: StoredDatabase | null, target: Database = db) => {
  target.clients.splice(0, target.clients.length, ...(Array.isArray(stored?.clients) ? stored.clients : []));
  target.messages.splice(0, target.messages.length, ...(Array.isArray(stored?.messages) ? stored.messages : []));
  target.voiceInteractions.splice(0, target.voiceInteractions.length, ...(Array.isArray(stored?.voiceInteractions) ? stored.voiceInteractions : []));
  target.callTasks.splice(0, target.callTasks.length, ...(Array.isArray(stored?.callTasks) ? stored.callTasks : []));
};

export const snapshotDatabase = (source: Database = db): StoredDatabase => ({
  clients: source.clients,
  messages: source.messages,
  voiceInteractions: source.voiceInteractions,
  callTasks: source.callTasks
});
