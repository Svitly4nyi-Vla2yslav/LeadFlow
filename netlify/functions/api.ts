import { getStore } from '@netlify/blobs';
import serverless from 'serverless-http';
import app from '../../apps/server/src/app';
import { db, type Client, type Message } from '../../apps/server/src/db/memory';

type StoredDatabase = { clients: Client[]; messages: Message[] };
type FunctionEvent = { httpMethod?: string; path?: string; rawUrl?: string };
type FunctionResponse = { statusCode: number; headers?: Record<string, string | number | boolean>; body?: string };

const DATABASE_KEY = 'database';
const expressHandler = serverless(app);

const hydrateDatabase = (stored: StoredDatabase | null) => {
  db.clients.splice(0, db.clients.length, ...(Array.isArray(stored?.clients) ? stored.clients : []));
  db.messages.splice(0, db.messages.length, ...(Array.isArray(stored?.messages) ? stored.messages : []));
};

const isDatabaseMutation = (event: FunctionEvent) => {
  const method = (event.httpMethod || 'GET').toUpperCase();
  const path = event.path || (event.rawUrl ? new URL(event.rawUrl).pathname : '');
  return !['GET', 'HEAD', 'OPTIONS'].includes(method) && /\/api\/(clients|messages)(\/|$)/.test(path);
};

export const handler = async (event: FunctionEvent, context: unknown): Promise<FunctionResponse> => {
  const store = getStore({ name: 'leadflow-crm', consistency: 'strong' });
  const entry = await store.getWithMetadata(DATABASE_KEY, { type: 'json' }) as { data: StoredDatabase; etag: string } | null;
  hydrateDatabase(entry?.data || null);

  const response = await expressHandler(event as never, context as never) as FunctionResponse;
  if (!isDatabaseMutation(event) || response.statusCode >= 500) return response;

  const snapshot: StoredDatabase = { clients: db.clients, messages: db.messages };
  const saved = entry
    ? await store.setJSON(DATABASE_KEY, snapshot, { onlyIfMatch: entry.etag })
    : await store.setJSON(DATABASE_KEY, snapshot, { onlyIfNew: true });

  if (!saved.modified) {
    return {
      statusCode: 409,
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ error: 'CRM data changed concurrently. Reload and retry.' })
    };
  }

  return response;
};
