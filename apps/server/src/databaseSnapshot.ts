import { CallTask, Client, Database, Message, VoiceInteraction, db } from './db/memory';

export type StoredDatabase = {
  clients: Client[];
  messages: Message[];
  voiceInteractions?: VoiceInteraction[];
  callTasks?: CallTask[];
};

export type MutationEvent = { httpMethod?: string; path?: string; rawUrl?: string };

/**
 * Визначає, чи HTTP-подія змінює одну з постійних CRM-колекцій.
 * Метод нормалізується до верхнього регістру, шлях береться з `path` або `rawUrl`;
 * GET, HEAD, OPTIONS і невідомі API-маршрути повертають `false`.
 */
export const isDatabaseMutation = (event: MutationEvent) => {
  const method = (event.httpMethod || 'GET').toUpperCase();
  const path = event.path || (event.rawUrl ? new URL(event.rawUrl).pathname : '');
  return !['GET', 'HEAD', 'OPTIONS'].includes(method)
    && /\/api\/(clients|messages|call-tasks|integrations\/voice-agent\/interactions|integrations\/voice-agent\/call-transcript)(\/|$)/.test(path);
};

/**
 * Повністю замінює масиви цільової in-memory бази даними зі збереженого знімка.
 * Відсутні або некоректні масиви стають порожніми; за замовчуванням змінюється глобальна `db`.
 */
export const hydrateDatabase = (stored: StoredDatabase | null, target: Database = db) => {
  target.clients.splice(0, target.clients.length, ...(Array.isArray(stored?.clients) ? stored.clients : []));
  target.messages.splice(0, target.messages.length, ...(Array.isArray(stored?.messages) ? stored.messages : []));
  target.voiceInteractions.splice(0, target.voiceInteractions.length, ...(Array.isArray(stored?.voiceInteractions) ? stored.voiceInteractions : []));
  target.callTasks.splice(0, target.callTasks.length, ...(Array.isArray(stored?.callTasks) ? stored.callTasks : []));
};

/**
 * Повертає серіалізоване представлення поточних CRM-колекцій.
 * За замовчуванням читає глобальну `db`; функція не клонує вкладені масиви й об'єкти.
 */
export const snapshotDatabase = (source: Database = db): StoredDatabase => ({
  clients: source.clients,
  messages: source.messages,
  voiceInteractions: source.voiceInteractions,
  callTasks: source.callTasks
});
